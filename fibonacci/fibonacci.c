#include <stdio.h>
#include <gmp.h>
#include <time.h>
#include <string.h>

void multiply(mpz_t F[2][2], mpz_t M[2][2]) {
    mpz_t x, y, z, w;
    mpz_inits(x, y, z, w, NULL);

    mpz_mul(x, F[0][0], M[0][0]);
    mpz_addmul(x, F[0][1], M[1][0]);

    mpz_mul(y, F[0][0], M[0][1]);
    mpz_addmul(y, F[0][1], M[1][1]);

    mpz_mul(z, F[1][0], M[0][0]);
    mpz_addmul(z, F[1][1], M[1][0]);

    mpz_mul(w, F[1][0], M[0][1]);
    mpz_addmul(w, F[1][1], M[1][1]);

    mpz_set(F[0][0], x);
    mpz_set(F[0][1], y);
    mpz_set(F[1][0], z);
    mpz_set(F[1][1], w);

    mpz_clears(x, y, z, w, NULL);
}

void power(mpz_t F[2][2], unsigned long long n) {
    if (n == 0 || n == 1) return;

    mpz_t M[2][2];
    mpz_inits(M[0][0], M[0][1], M[1][0], M[1][1], NULL);
    mpz_set_ui(M[0][0], 1);
    mpz_set_ui(M[0][1], 1);
    mpz_set_ui(M[1][0], 1);
    mpz_set_ui(M[1][1], 0);

    power(F, n / 2);
    multiply(F, F);

    if (n % 2 != 0)
        multiply(F, M);

    mpz_clears(M[0][0], M[0][1], M[1][0], M[1][1], NULL);
}

void fibonacci(mpz_t result, unsigned long long n) {
    if (n == 0) {
        mpz_set_ui(result, 0);
        return;
    }

    mpz_t F[2][2];
    mpz_inits(F[0][0], F[0][1], F[1][0], F[1][1], NULL);
    mpz_set_ui(F[0][0], 1);
    mpz_set_ui(F[0][1], 1);
    mpz_set_ui(F[1][0], 1);
    mpz_set_ui(F[1][1], 0);

    power(F, n - 1);
    mpz_set(result, F[0][0]);

    mpz_clears(F[0][0], F[0][1], F[1][0], F[1][1], NULL);
}

int main(int argc, char *argv[]) {
    unsigned long long n;
    printf("Enter the index of the Fibonacci number to calculate: ");
    scanf("%llu", &n);

    mpz_t result;
    mpz_init(result);

    clock_t start = clock();
    fibonacci(result, n);
    clock_t end = clock();

    double time_spent = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Fibonacci number F(%llu):\n", n);
    mpz_out_str(stdout, 10, result);
    printf("\nCalculation Time: %f seconds\n", time_spent);

    // Check for 's' argument to save the result
    if (argc > 1 && strcmp(argv[1], "s") == 0) {
        // Create the filename based on Fibonacci index
        char filename[50];
        sprintf(filename, "fibonacci(%llu).txt", n);

        // Open the file and write the result
        FILE *file = fopen(filename, "w");
        if (file == NULL) {
            perror("Error opening file");
            mpz_clear(result);
            return 1;
        }
        
        mpz_out_str(file, 10, result);
        fclose(file);

        printf("Result saved to %s\n", filename);
    }

    mpz_clear(result);
    return 0;
}

