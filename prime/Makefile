
CC = gcc
CFLAGS = -Wall -g
PRIME_TARGET = prime

all: $(PRIME_TARGET)

$(PRIME_TARGET): prime.o
	$(CC) $(CFLAGS) -o $(PRIME_TARGET) prime.o

prime.o: prime.c
	$(CC) $(CFLAGS) -c prime.c

clean:
	rm -f *.o $(PRIME_TARGET)
