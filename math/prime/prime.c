#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

#define BATCH_SIZE 10000

int is_prime(unsigned long long n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (unsigned long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return 0;
    }
    return 1;
}

unsigned long long load_last_prime() {
    unsigned long long last_prime = 2; // Default start
    FILE *file = fopen("prime_state.txt", "r");
    if (file) {
        fscanf(file, "%llu", &last_prime);
        fclose(file);
    }
    return last_prime;
}

void save_last_prime(unsigned long long prime) {
    FILE *file = fopen("prime_state.txt", "w");
    if (file) {
        fprintf(file, "%llu\n", prime);
        fclose(file);
        printf("Saved current prime: %llu\n", prime);
    } else {
        perror("Error saving prime state");
    }
}

void find_primes_in_batch(unsigned long long start, unsigned long long *last_prime) {
    for (unsigned long long num = start; num < start + BATCH_SIZE; num += 2) {
        if (is_prime(num)) {
            printf("Found prime: %llu\n", num);
            *last_prime = num;
        }
    }
}

int main() {
    unsigned long long current = load_last_prime();
    printf("Starting from prime: %llu\n", current);

    if (current <= 2) current = 3;  // Start from 3 if resuming from the beginning
    if (current % 2 == 0) current++; // Make sure we start with an odd number

    time_t start_time = time(NULL);

    while (1) {
        find_primes_in_batch(current, &current);
        current += BATCH_SIZE;  // Move to the next batch starting point

        // Save progress every 1 minute
        if (difftime(time(NULL), start_time) >= 60) {
            save_last_prime(current);
            start_time = time(NULL); // Reset timer
        }
    }

    return 0;
}
