import { NextApiRequest, NextApiResponse } from "next";

export type AnkhApiRequest = NextApiRequest;
export type AnkhApiResponse = NextApiResponse;
export type AnkhClosure = (req: AnkhApiRequest) => AnkhApiResponse;
export type AnkhHandler = (req: AnkhApiRequest, res: AnkhApiResponse) => void | AnkhApiResponse;