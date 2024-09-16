import { z } from 'zod';

// schema validation using zod
export const acceptMsgSchema = z.object({
    isAcceptingMsg: z.boolean()
})