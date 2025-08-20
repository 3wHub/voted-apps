export enum VoteType {
  BASIC = 'basic',
  POLITICAL = 'political',
  EVENT_DATE = 'event_date',
  GENERAL_SURVEY = 'general_survey',
  TEAM_DECISION = 'team_decision'
}

export interface Vote {
  id: string;
  title: string;
  description?: string;
  location?: string;
  type: VoteType;
  options: VoteOption[];
  tags: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  creator: string;
  status: 'active' | 'closed';
}

export interface VoteOption {
  id: string;
  label: string;
  votes: number;
}

export interface VoteTemplate {
  id: VoteType;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
  fields: VoteTemplateField[];
}

export interface VoteTemplateField {
  name: 'question' | 'description' | 'location' | 'options' | 'date';
  label: string;
  type: 'text' | 'description' | 'location' | 'options' | 'date';
  required: boolean;
  placeholder?: string;
}

export const voteTemplates: VoteTemplate[] = [
  {
    id: VoteType.BASIC,
    name: 'Basic Vote',
    description: 'A simple poll with customizable options',
    icon: '📊',
    isPremium: false,
    fields: [
      {
        name: 'question',
        label: 'Question',
        type: 'text',
        required: true,
        placeholder: 'What do you want to vote on?'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'description',
        required: false
      },
      {
        name: 'options',
        label: 'Options',
        type: 'options',
        required: true
      },
      {
        name: 'date',
        label: 'Voting Period',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: VoteType.POLITICAL,
    name: 'Political Poll',
    description: 'Gather opinions on political topics and issues',
    icon: '🗳️',
    isPremium: true,
    fields: [
      {
        name: 'question',
        label: 'Question',
        type: 'text',
        required: true,
        placeholder: 'What is your stance on...?'
      },
      {
        name: 'description',
        label: 'Context',
        type: 'description',
        required: true
      },
      {
        name: 'options',
        label: 'Options',
        type: 'options',
        required: true
      },
      {
        name: 'date',
        label: 'Polling Period',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: VoteType.EVENT_DATE,
    name: 'Event Date Poll',
    description: 'Find the best date and time for your event',
    icon: '📅',
    isPremium: true,
    fields: [
      {
        name: 'question',
        label: 'Event Name',
        type: 'text',
        required: true,
        placeholder: 'What event are you planning?'
      },
      {
        name: 'description',
        label: 'Event Description',
        type: 'description',
        required: true
      },
      {
        name: 'location',
        label: 'Location',
        type: 'location',
        required: true
      },
      {
        name: 'options',
        label: 'Proposed Dates',
        type: 'options',
        required: true
      },
      {
        name: 'date',
        label: 'Response Deadline',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: VoteType.GENERAL_SURVEY,
    name: 'General Survey',
    description: 'Create a comprehensive survey with multiple options',
    icon: '📝',
    isPremium: true,
    fields: [
      {
        name: 'question',
        label: 'Survey Title',
        type: 'text',
        required: true,
        placeholder: 'What would you like to survey?'
      },
      {
        name: 'description',
        label: 'Survey Description',
        type: 'description',
        required: true
      },
      {
        name: 'options',
        label: 'Survey Options',
        type: 'options',
        required: true
      },
      {
        name: 'date',
        label: 'Survey Period',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: VoteType.TEAM_DECISION,
    name: 'Team Decision',
    description: 'Make collaborative decisions with your team',
    icon: '👥',
    isPremium: true,
    fields: [
      {
        name: 'question',
        label: 'Decision Topic',
        type: 'text',
        required: true,
        placeholder: 'What needs to be decided?'
      },
      {
        name: 'description',
        label: 'Context & Background',
        type: 'description',
        required: true
      },
      {
        name: 'options',
        label: 'Available Options',
        type: 'options',
        required: true
      },
      {
        name: 'date',
        label: 'Decision Deadline',
        type: 'date',
        required: true
      }
    ]
  }
];
