from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from io import BytesIO
import math

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


FONT = (
    Path(__file__).resolve().parent.parent
    / "fonts"
    / "StandardErrorVF.ttf"
)

AXES = ["DISP", "REPT", "DIST", "UNIF", "RECG"]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)

        try:
            values = {}

            for tag in AXES:
                value = float(query.get(tag, ["0"])[0])

                if (
                    not math.isfinite(value)
                    or not 0 <= value <= 100
                    or not value.is_integer()
                ):
                    raise ValueError("Invalid axis value")

                values[tag] = int(value)

        except (ValueError, TypeError):
            self.send_error(400, "Invalid axis values")
            return

        try:
            with TTFont(FONT) as variable:
                static = instantiateVariableFont(
                    variable,
                    values,
                    inplace=False,
                    optimize=True
                )

            suffix = "-".join(
                f"{tag}{values[tag]}" for tag in AXES
            )

            family = f"Standard Error {suffix}"
            ps_name = "SE-" + "-".join(
                str(values[tag]) for tag in AXES
            )

            names = {
                1: family,
                2: "Regular",
                3: f"{ps_name};1.000",
                4: family,
                6: ps_name,
                16: family,
                17: "Regular"
            }

            for name_id, text in names.items():
                static["name"].removeNames(nameID=name_id)
                static["name"].setName(
                    text, name_id, 3, 1, 0x409
                )

            output = BytesIO()
            static.save(output)
            static.close()

            data = output.getvalue()

        except Exception as error:
            print(f"Font export failed: {error}")
            self.send_error(500, "Font export failed")
            return

        self.send_response(200)
        self.send_header("Content-Type", "font/ttf")
        self.send_header(
            "Content-Disposition",
            f'attachment; filename="StandardError-{suffix}.ttf"'
        )
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)