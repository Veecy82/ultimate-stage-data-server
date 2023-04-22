import os

directory = os.fsencode("./")

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    
    if filename.endswith(".png"):
        if "00" not in filename:
            os.remove(filename)