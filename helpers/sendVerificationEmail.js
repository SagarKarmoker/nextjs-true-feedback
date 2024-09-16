import { resend } from '@/lib/resend';
import VerificationEmail from '@/emails/VerificationEmail';

export async function sendVerificationEmail(email, username, otp) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'True Feedback <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username: username, otp: otp }),
        });

        if (error) {
            return error;
        }

        return data;
    } catch (error) {
        console.log(error)
        return error;
    }
}