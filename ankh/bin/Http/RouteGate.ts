import { AnkhApiRequest, AnkhApiResponse, Continue, Abort } from '@ankh/bin/Http/types.d';
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
type Methods = Method[];

export function RouteGate(
    req: AnkhApiRequest,
    res: AnkhApiResponse,
    methods: Methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
) {
    if (methods.includes(req.method as Method)) {
        return Continue;
    }
    res.status(405).json({
        message: `Method ${req.method} not allowed for this route.`
    });
    return Abort;
}