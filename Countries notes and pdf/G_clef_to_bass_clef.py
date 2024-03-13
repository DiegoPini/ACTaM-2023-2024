# converti chiave violino in basso

# da 40 a 52

# do 60->40  mi
# re 62->41  fa
# mi 64->43  sol
# fa 65->45  la
# sol 67->47  si
# la 69->48  do
# si 71->50->38  re
# do 72->52->40  mi


input_str = input("Enter input vector: ")
input = [int(i) for i in input_str.split(',')]

for i in range(len(input)):
    if input[i] == 60:
        input[i] = 40
    elif input[i] == 62:
        input[i] = 41
    elif input[i] == 64:
        input[i] = 43
    elif input[i] == 65:
        input[i] = 45
    elif input[i] == 67:
        input[i] = 47
    elif input[i] == 69:
        input[i] = 48
    elif input[i] == 71:
        input[i] = 38
    elif input[i] == 72:
        input[i] = 40



print(input)