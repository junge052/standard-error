"""Local website + real static TrueType export. Run: python server.py"""
from functools import lru_cache
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from io import BytesIO
import math
import os
import argparse
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent
FONT = ROOT / 'fonts' / 'StandardErrorVF.ttf'
AXES = ('DISP', 'REPT', 'DIST', 'UNIF', 'RECG')

@lru_cache(maxsize=16)
def export_instance(coordinates):
    font = TTFont(FONT)
    instance = instantiateVariableFont(font, dict(zip(AXES, coordinates)), inplace=True, optimize=True)
    suffix = '-'.join(f'{tag}{value}' for tag, value in zip(AXES, coordinates))
    family = f'Standard Error {suffix}'
    ps_name = 'SE-' + '-'.join(str(v) for v in coordinates)
    # Distinct naming allows multiple exported combinations to be installed.
    names = {1:family, 2:'Regular', 3:f'{ps_name};1.000', 4:family, 6:ps_name, 16:family, 17:'Regular'}
    for record in list(instance['name'].names):
        if record.nameID in names:
            instance['name'].removeNames(nameID=record.nameID, platformID=record.platformID, platEncID=record.platEncID, langID=record.langID)
    for name_id, value in names.items():
        instance['name'].setName(value, name_id, 3, 1, 0x409)
    assert 'fvar' not in instance, 'Expected a fully static instance'
    output = BytesIO()
    instance.save(output)
    instance.close()
    return output.getvalue()

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != '/api/instance':
            return super().do_GET()
        query = parse_qs(parsed.query)
        try:
            coords = []
            for tag in AXES:
                value = float(query.get(tag, ['0'])[0])
                if not math.isfinite(value) or not 0 <= value <= 100 or value != int(value):
                    raise ValueError('Axes must be integers between 0 and 100')
                coords.append(int(value))
        except (ValueError, TypeError):
            self.send_error(400, 'Invalid axis values')
            return
        try:
            data = export_instance(tuple(coords))
        except Exception:
            self.send_error(500, 'Font export failed')
            return
        self.send_response(200)
        self.send_header('Content-Type', 'font/ttf')
        self.send_header('Content-Disposition', 'attachment; filename="StandardError-Static.ttf"')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    os.chdir(ROOT)
    print(f'Open http://localhost:{args.port} — Ctrl+C to stop', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
