export enum VoteType {
    BASIC = 'BASIC',
    POLITICAL = 'POLITICAL',
    EVENT_DATE = 'EVENT_DATE',
    GENERAL_SURVEY = 'GENERAL_SURVEY',
    TEAM_DECISION = 'TEAM_DECISION'
}

export interface VoteTemplate {
    id: VoteType;
    name: string;
    description: string;
    fields: VoteTemplateField[];
    icon: string;
    isPremium: boolean;
}

export interface VoteTemplateField {
    name: string;
    type: 'text' | 'date' | 'options' | 'location' | 'description';
    label: string;
    required?: boolean;
    placeholder?: string;
}

export const voteTemplates: VoteTemplate[] = [
    {
        id: VoteType.BASIC,
        name: 'Basic Vote',
        description: 'Simple voting template for basic polls',
        icon: '📊',
        isPremium: false,
        fields: [
            {
                name: 'question',
                type: 'text',
                label: 'Question',
                required: true,
                placeholder: 'What would you like to ask?'
            },
            {
                name: 'options',
                type: 'options',
                label: 'Options',
                required: true
            }
        ]
    },
    {
        id: VoteType.POLITICAL,
        name: 'Political Poll',
        description: 'Template for political surveys and elections',
        icon: '🗳️',
        isPremium: true,
        fields: [
            {
                name: 'question',
                type: 'text',
                label: 'Election Question',
                required: true,
                placeholder: 'What is the election about?'
            },
            {
                name: 'description',
                type: 'description',
                label: 'Detailed Description',
                required: true
            },
            {
                name: 'location',
                type: 'location',
                label: 'Election Location',
                required: true
            },
            {
                name: 'options',
                type: 'options',
                label: 'Candidates/Options',
                required: true
            }
        ]
    },
    {
        id: VoteType.EVENT_DATE,
        name: 'Event Date Poll',
        description: 'Choose the best date for an event',
        icon: '📅',
        isPremium: true,
        fields: [
            {
                name: 'question',
                type: 'text',
                label: 'Event Name',
                required: true,
                placeholder: 'What event are you planning?'
            },
            {
                name: 'description',
                type: 'description',
                label: 'Event Description',
                required: true
            },
            {
                name: 'options',
                type: 'date',
                label: 'Possible Dates',
                required: true
            }
        ]
    },
    {
        id: VoteType.GENERAL_SURVEY,
        name: 'General Survey',
        description: 'Comprehensive survey with multiple questions',
        icon: '📝',
        isPremium: true,
        fields: [
            {
                name: 'question',
                type: 'text',
                label: 'Survey Title',
                required: true
            },
            {
                name: 'description',
                type: 'description',
                label: 'Survey Description',
                required: true
            },
            {
                name: 'options',
                type: 'options',
                label: 'Questions and Options',
                required: true
            }
        ]
    }
];
