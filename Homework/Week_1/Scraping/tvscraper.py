#!/usr/bin/env python
# Name: Bas Katsma
# Student number: 10787690
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
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

    # create list to store data
    tvShows = []

    # get amount of results per page
    pageLimit = dom.find("span", "lister-current-last-item")

    # get correct containers for each listed show
    tvContainer = dom.find_all("div", "lister-item mode-advanced")

    # loop through all shows on the page
    for result in range(int(pageLimit.text)):

        # create temp
        temp = []

        # get the correct container for each show
        show = tvContainer[result]

        # get title and add to temp list
        showTitle = show.h3.a.text
        temp.append(showTitle)

        # get rating and add to temp list
        showRating = show.strong.text
        temp.append(float(showRating))

        # get genre, remove all mark-up and add to temp list
        showGenre = show.find("span", "genre")
        fixedGenre = showGenre.text.strip().replace(" ", "").split(',')
        for genre in range(len(fixedGenre)):
            temp.append(fixedGenre[genre])

        # get all listed (4) actors/actresses and add to temp list
        showPeople = show.find_all("a")
        for person in showPeople[13:17]:
            temp.append(person.text.strip())

        # get numbers from runtime
        showRuntime = show.find("span", "runtime")
        fixedRuntime = showRuntime.text.split()
        temp.append(int(fixedRuntime[0]))

        # add each temp list to the tvShows list
        tvShows.append(temp)

    return tvShows

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for show in range(len(tvseries)):
        writer.writerow(tvseries[show])

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
