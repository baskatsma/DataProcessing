#!/usr/bin/env python
# Name: Bas Katsma
# Student number: 10787690
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # create lists to store data
    tvTitle = []
    tvRating = []
    tvGenre = []
    tvPeople = []
    tvRuntime = []

    # get amount of results per page
    pageLimit = dom.find("span", "lister-current-last-item")

    # get correct containers for each listed show
    tvContainer = dom.find_all("div", "lister-item mode-advanced")

    # loop through all results on the page
    for result in range(int(pageLimit.text)):

        # get the correct container for each show
        show = tvContainer[result]

        # get the correct fields from each container
        showTitle = show.h3.a.text
        #print(showTitle)
        tvTitle.append(showTitle)

        showRating = show.strong.text
        #print(float(showRating))
        tvRating.append(float(showRating))

        showGenre = show.find("span", "genre")
        #print(showGenre.text.replace(" ", ""))
        tvGenre.append(showGenre.text.rstrip().lstrip())

        showPeople = show.find_all("a")
        tempList = []
        #i = 0
        for person in showPeople[13:17]:
            #if i < 3:
                #print(person.text + ",", end="")
                #tempList.append(person.text)
            #else:
                #print(person.text, end="")
                #tempList.append(person.text)
            #i += 1
            tempList.append(person.text.rstrip().lstrip())
        tvPeople.append(tempList)

        # grab numbers from string
        showRuntime = re.findall('\d+', str(show.find("span", "runtime")))
        #print(int(showRuntime[0]))
        tvRuntime.append(int(showRuntime[0].rstrip().lstrip()))

    print(tvTitle)
    print(tvRating)
    print(tvGenre)
    print(tvPeople)
    print(tvRuntime)
    return [tvTitle, tvRating, tvGenre, tvPeople, tvRuntime]

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile, delimiter=',')
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    ## 0 = title
    ## 1 = rating
    ## 2 = genre
    ## 3 = people
    ## 4 = runtime
    print("PRINTING tvseries[0]...")
    print(tvseries[0])
    print("PRINTING tvseries[1]...")
    print(tvseries[1])

    #for show in range(50):
        #for category in range(show):
            #writer.writerow(tvseries[category][show])
            #print(tvseries[category][show])
            #category += 1
        #show += 1

    tvshow = 0
    category = 0
    for tvshow in range(50):
        writer.writerow([tvseries[category][tvshow]])
        tvshow += 1

    #writer.writerow([tvseries[0][0]])
    #writer.writerow([tvseries[0][1]])
    #writer.writerow([tvseries[1][0]])
    #writer.writerow([tvseries[1][1]])
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
