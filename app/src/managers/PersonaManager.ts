interface Persona {
    name: string;
    description: string;
    voiceStyle: string;
}

export class PersonaManager {
    private enviroment: Map<string, Map<string, Persona>> = new Map();

    constructor() {
        this.enviroment.set("global", new Map());
    }

    public createPersona(guildId: string, persona: Persona): string {
        let personas = this.enviroment.get(guildId);
        
        if (!personas) {
            personas = new Map();
            this.enviroment.set(guildId, personas);
        }

        personas.set(persona.name, persona);
        return `Persona '${persona.name}' created successfully.`;
    }

    public getPersona(guildId: string, name: string): Persona | null {
        return this.enviroment.get(guildId)?.get(name) || null;
    }
}
