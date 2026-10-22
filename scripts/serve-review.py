#!/usr/bin/env python3
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=4221)
parser.add_argument('--directory', required=True)
args = parser.parse_args()
rules = []
for line in (Path(args.directory) / '_headers').read_text().splitlines():
    if not line.strip() or line.lstrip().startswith('#'):
        continue
    if not line.startswith((' ', '\t')):
        rules.append((line.strip(), {}))
    elif rules and ':' in line:
        name, value = line.strip().split(':', 1)
        rules[-1][1][name] = value.strip()

class HeaderHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = urlsplit(self.path).path
        headers = {}
        for pattern, supplied in rules:
            if path == pattern or pattern.endswith('*') and path.startswith(pattern[:-1]):
                headers.update(supplied)
        for name, value in headers.items():
            self.send_header(name, value)
        super().end_headers()

    def log_message(self, *_args):
        pass

ThreadingHTTPServer(('127.0.0.1', args.port), partial(HeaderHandler, directory=args.directory)).serve_forever()
