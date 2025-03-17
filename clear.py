import os
folder = 'public/tiles'
files = os.listdir(folder)
for filename in files:
    if not filename.endswith('_0.jpg'):
        os.remove(f'{folder}/{filename}')
print(files)