import urllib, time, schedule
from urllib.request import urlopen
from bs4 import BeautifulSoup


def gnar():
    url = urllib.request.urlopen("http://www.mtbachelor.com/conditions-report/")
    source = BeautifulSoup(url)
    # get all of the divs with the class name statuses, this is the easiest way to find the lifts
    divs = source.findAll("div", {"class": "statuses"})
    lifts = []
    # there are two types of objects with this class name, runs and lifts. Lifts have 5 attributes, the 4th on being
    # the icon for the size of the lift. Find all the classes that contain this icon. Skip it and don't add it to the
    # list if it doesn't have this icon.
    for i in divs:
            try:
                if i.contents[3]:
                    lifts.append(i)
            except IndexError:
                pass
            continue

    # 8th element in the list represents the Summit chair. Look through its contents to see if the lift status is open
    if str(lifts[7].contents[1].contents[0]) == '<i class="icon-status-open"></i>':
        return 1
    else:
        return 0


if __name__ == "__main__":
    schedule.every(15).minutes.do(gnar)
    while 1:
        schedule.run_pending()
     print("suh dude +s")