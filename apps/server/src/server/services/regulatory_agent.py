from langchain_openai import ChatOpenAI
from langchain_qdrant import QdrantVectorStore
from server.lib.prompt_builder import PromptBuilder
from server.config.config import config
from .prompts import PromptFiles


class RegulatoryAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=config.LLM_MODEL,
            temperature=0.1,
            api_key=config.OPENAI_API_KEY
        )

    async def invoke(self, query: str, vector_store: QdrantVectorStore) -> str:
        results = vector_store.similarity_search_with_score(
            query=query,
            k=5,
            score_threshold=0.5
        )

        context = "\n".join(doc.page_content for doc, _ in results) if results else ""

        prompt_builder = PromptBuilder(PromptFiles["regulatory_agent"])
        messages = prompt_builder.build_prompts(context=context, query=query)

        response = await self.llm.ainvoke(messages)
        return response.text


regulatory_agent = RegulatoryAgent()
