#!/usr/bin/env python3
"""Bundle the Medication Guide while preserving all previously supplied materials."""
import hashlib
import json
import stat
import zipfile
from pathlib import Path

root = Path('dist')
target = Path('downloads/conhecendo-a-cti-guia-medicamentos.zip')
baseline = Path('downloads/conhecendo-a-cti-dicionario-clinico.zip')
evidence = Path('docs/medicamentos/evidencias/pacote.json')
files = sorted(path for path in root.rglob('*') if path.is_file())
assert files and (root / 'index.html').is_file(), 'Execute npm run build antes de empacotar.'
assert not any(path.is_symlink() for path in files)
target.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files:
        name = path.relative_to(root).as_posix()
        assert path.stat().st_size < 25 * 1024 * 1024, name
        info = zipfile.ZipInfo(name, date_time=(2026, 10, 31, 12, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.create_system = 3
        info.external_attr = (stat.S_IFREG | 0o644) << 16
        archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

preserved = []
allowed_additions = set()
with zipfile.ZipFile(target) as archive, zipfile.ZipFile(baseline) as previous:
    assert archive.testzip() is None
    names = archive.namelist()
    assert 'index.html' in names and len(names) == len(set(names)) < 1000
    assert set(names) == {path.relative_to(root).as_posix() for path in files}
    old_materials = {name for name in previous.namelist() if name.startswith(('caderno/', 'materiais/'))}
    new_materials = {name for name in names if name.startswith(('caderno/', 'materiais/'))}
    assert old_materials <= new_materials
    assert new_materials - old_materials == allowed_additions
    for name in names:
        assert '..' not in Path(name).parts and not Path(name).is_absolute(), name
        data = archive.read(name)
        assert data == (root / name).read_bytes(), name
        if name in old_materials:
            assert data == previous.read(name), f'Material anterior alterado: {name}'
            preserved.append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
assert len(preserved) == 108
assert target.stat().st_size < 100 * 1024 * 1024
metadata = {
    'path': str(target), 'files': len(files), 'bytes': target.stat().st_size,
    'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
    'cache': (root / 'sw.js').read_text().splitlines()[0],
    'crc_valid': True, 'matches_dist': True, 'safe_paths': True,
    'baseline': str(baseline), 'preserved_assets': len(preserved), 'preserved': preserved,
    'added_materials': sorted(allowed_additions), 'production_deployed': False,
}
evidence.parent.mkdir(parents=True, exist_ok=True)
evidence.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: value for key, value in metadata.items() if key != 'preserved'}, ensure_ascii=False, indent=2))
