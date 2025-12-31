/**
 * Utility class for formatting HTTP messages to be more readable for AI assistants.
 */
export class HttpFormatter {
    /**
     * Formats a raw HTTP request or response string.
     * Tries to prettify JSON bodies and organize headers.
     */
    public static formatHttp(rawMessage: string): string {
        if (!rawMessage) {
            return '';
        }

        // Split headers and body
        const parts = rawMessage.split(/\r\n\r\n|\n\n/);
        const headers = parts[0];
        const body = parts.slice(1).join('\n\n');

        let formattedMessage = headers;

        if (body) {
            formattedMessage += '\n\n' + this.formatBody(body);
        }

        return formattedMessage;
    }

    /**
     * Formats the body content, specifically trying to prettify JSON.
     */
    private static formatBody(body: string): string {
        try {
            // fast check if it looks like JSON
            const trimmed = body.trim();
            if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                const jsonObj = JSON.parse(body);
                return JSON.stringify(jsonObj, null, 2);
            }
        } catch (e) {
            // Not JSON or invalid JSON, return original
        }
        return body;
    }

    /**
     * Extracts a clean URL from a potential burp history item or raw request line
     */
    public static normalizeUrl(url: string): string {
        try {
            return new URL(url).toString();
        } catch {
            return url;
        }
    }

    /**
     * Wraps content in a markdown code block with language hint
     */
    public static toMarkdownBlock(content: string, language: string = 'http'): string {
        return "```" + language + "\n" + content + "\n```";
    }
}
