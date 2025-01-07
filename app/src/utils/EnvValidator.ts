import 'dotenv/config';

export class EnvValidator {
    public static validate(requiredVars: string[]): void {
        const missingVars = requiredVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
        }
    }
}