import SlackREST from "@sagi.io/workers-slack"
// https://hono.dev/
import { Hono } from "hono"
import faunadb from "faunadb"

import plusses from "./handlers/plusses"

type Bindings = {
  SLACK_SIGNING_SECRET: string
  SLACK_BOT_ACCESS_TOKEN: string
  FAUNADB_SECRET: string
  FAUNADB_ENDPOINT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post("/plusses", async (c) => {
  const faunaClient = new faunadb.Client({
    secret: c.env.FAUNADB_SECRET as string,
    domain: "db.fauna.com"
  })

  const body = await c.req.parseBody()
  return await plusses(body, faunaClient)
})

app.get("*", async (request) => {
  return new Response("Page not found", { status: 404 })
})

export default <ExportedHandler<EnvBindings>>{
  async fetch(request, env, context) {
    try {
      const botAccessToken = env.SLACK_BOT_ACCESS_TOKEN
      const SlackAPI = new SlackREST({ botAccessToken })

      // If this is not a valid request from slack, it will throw an error.
      // Otherwise, isVerifiedRequest is true
      const signingSecret = env.SLACK_SIGNING_SECRET
      const isVerifiedRequest = await SlackAPI.helpers.verifyRequestSignature(
        request,
        signingSecret
      )

      return app.fetch(request, env, context)
    } catch (e) {
      console.log(e)
      return new Response("Internal error. Contact #engineer-helpdesk.", {
        status: 500
      })
    }
  }
}
