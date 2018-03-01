#!/usr/bin/env python
#
#  Name: Bas Katsma
#  Student 10787690
#  Homework - Week 4
#
"""
This script converts CSV to JSON.
"""

import csv
import json
from collections import OrderedDict

if __name__ == "__main__":

    # Initialize the keys
    JSONKeyNames=["country", "region", "lifeExpectancy", "wellbeing"]

    # Create blank array to store the new data in
    dataStorage = []

    # Read data file
    with open("data_edited.csv", "r") as dataFile:
        dataReader = csv.DictReader(dataFile, JSONKeyNames, delimiter=";")

        # Iterate over each line
        for line in dataReader:

            # Match each value with its corresponding key
            data = OrderedDict()
            for key in JSONKeyNames:

                # Remove whitespace and weird characters
                data[key] = line[key].strip().replace("\ufeff", "")
            dataStorage.append(data)

    # Create new JSON file and use .dump to convert
    with open("data_edited.json", "w+") as JSONFile:
        json.dump(dataStorage, JSONFile, indent=4)

    # Close all files
    dataFile.close()
    JSONFile.close()
