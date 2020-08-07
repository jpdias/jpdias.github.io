import zipfile
import timeit
import sys


argv = sys.argv

zFile = zipfile.ZipFile(str(argv[1]))
dictionary_attack = argv[2]


def Cracker():

    attempts = 0
    flag = 0
    with open(dictionary_attack, 'r') as attack:
        print("Cracking password...one sec")
        print("------------------------------")
        for line in attack:
            try:
                # from the wordlist there is newline
                # they need to be stripped
                # encode passwd from str to bytes
                passwd = line.strip('\n')
                zFile.extractall(pwd=str.encode(passwd))
            except Exception:
                attempts += 1
                pass
            else:
                print("Success! Password is %s" % (passwd))
                flag = 1
                break
        print("Attempted %d passwords from %s wordlist" %
              (attempts, dictionary_attack))
        if flag == 0:
            print("Password Cracking Failed! It is too strong for me :(")


if __name__ == "__main__":
    # starts the timer
    start = timeit.default_timer()
    Cracker()
    # timer stops
    stop = timeit.default_timer()
    # calculating the time it took to crack the password
    print("zip-cracker crack it in %d secs" % (stop - start))

