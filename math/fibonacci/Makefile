
CC = gcc
CFLAGS = -Wall -g
FIB_TARGET = fibonacci

all: $(FIB_TARGET)

$(FIB_TARGET): fibonacci.o
	$(CC) $(CFLAGS) -o $(FIB_TARGET) fibonacci.o -lgmp

fibonacci.o: fibonacci.c
	$(CC) $(CFLAGS) -c fibonacci.c

clean:
	rm -f *.o $(FIB_TARGET)
