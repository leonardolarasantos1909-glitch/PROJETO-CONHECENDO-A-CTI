#!/usr/bin/env python3
"""Package only the tested static build and verify preservation of supplied assets."""
import hashlib
import json
import stat
import zipfile
from pathlib import Path

root = Path('dist')
target = Path('downloads/conhecendo-a-cti-final-revisao.zip')
baseline = Path('downloads/conhecendo-a-cti-v14.zip')
metadata_file = Path('docs/entrega-final/evidencias/pacote.json')
files = sorted(path for path in root.rglob('*') if path.is_file())
assert files and (root / 'index.html').is_file(), 'Execute npm run build antes de empacotar.'
assert not any(path.is_symlink() for path in files), 'Não são permitidos links simbólicos.'
target.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files:
        name = path.relative_to(root).as_posix()
        assert path.stat().st_size < 25 * 1024 * 1024, name
        info = zipfile.ZipInfo(name, date_time=(2026, 10, 22, 12, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.create_system = 3
        info.external_attr = (stat.S_IFREG | 0o644) << 16
        archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

preserved = []
with zipfile.ZipFile(target) as archive, zipfile.ZipFile(baseline) as previous:
    assert archive.testzip() is None, 'CRC inválido.'
    names = archive.namelist()
    assert 'index.html' in names
    assert len(names) == len(set(names)) < 1000
    assert set(names) == {path.relative_to(root).as_posix() for path in files}
    previous_materials = {name for name in previous.namelist() if name.startswith(('caderno/', 'materiais/'))}
    assert {name for name in names if name.startswith(('caderno/', 'materiais/'))} == previous_materials
    for name in names:
        assert '..' not in Path(name).parts and not Path(name).is_absolute(), name
        data = archive.read(name)
        assert data == (root / name).read_bytes(), name
        if name in previous_materials:
            assert data == previous.read(name), f'Material alterado: {name}'
            preserved.append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})

assert target.stat().st_size < 100 * 1024 * 1024
assert len(preserved) == 105
metadata = {
    'path': str(target), 'files': len(files), 'bytes': target.stat().st_size,
    'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
    'cache': (root / 'sw.js').read_text().splitlines()[0],
    'crc_valid': True, 'matches_dist': True, 'safe_paths': True,
    'baseline': str(baseline), 'preserved_assets': len(preserved),
    'preserved': preserved, 'production_deployed': False,
}
metadata_file.parent.mkdir(parents=True, exist_ok=True)
metadata_file.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: value for key, value in metadata.items() if key != 'preserved'}, ensure_ascii=False, indent=2))
