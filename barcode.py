import sys
   
# Pi recieves the input from the barcode scanner
# stores value as an integer
# functions returns the value
def barcode_reader():
     code = int(input("Please scan a barcode: \n"))
     print("\n")

     return code
     
# ------ TESTING -----------

if __name__ == '__main__':
    try:
        while True:
            scan = barcode_reader() # scan and decode raspberry pi output

            # printing to see the UPC
            print("-----------")
            print("YOUR BARCODE:\n")
            print(scan)
            print("-----------\n")

    except KeyboardInterrupt: # when inputting Crt + C or Delete, stops the program
        pass
