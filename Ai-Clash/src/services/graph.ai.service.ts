import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";


const State = new StateSchema({
    messages: MessagesValue,
});

const solutionNode: GraphNode<typeof State> = (state) => {

    console.log(state.messages);
    return {
        messages: state.messages
    }
}

const graph = new StateGraph(State)
      .addNode("solution", solutionNode)
      .addEdge(START, "solution")
      .addEdge("solution", END)
      .compile();

      export default async function(userMessage:string) {
        const result = await graph.invoke({
            messages:[
                new HumanMessage(userMessage)
            ]
        })

        return result.messages
      }
