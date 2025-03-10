export interface UfoSighting {
    id: number;
    witnessName: string;
    location: {
      latitude: number;
      longitude: number;
    };
    description: string;
    picture: string;
    status: string;
    dateTime: string;
    witnessContact: string;
  }