import tarfile

with tarfile.open('sqlite.tar.gz') as tar:
  tar.extractall()
