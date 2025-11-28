import yaml
from pathlib import Path
from string import Template
from typing import List, Optional
from .types import PromptField, PromptFile
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage


class PromptBuilder:
    def __init__(self, file_path: Path):
        full_path = file_path
        if not full_path.is_absolute():
            full_path = Path.cwd() / full_path

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                raw_file = yaml.safe_load(f)
            self.file = PromptFile.model_validate(raw_file)
        except Exception as e:
            raise RuntimeError(f"Error loading prompt file: {e}") from e

    def _get_prompt_string(self, field: str, version: Optional[str] = None) -> str:
        prompt_field: PromptField = getattr(self.file, field)
        target_version = version or prompt_field["stable"]
        try:
            return prompt_field[target_version]
        except KeyError:
            raise ValueError(f'Prompt version "{target_version}" not found in field "{field}"')

    def _format_prompt(self, template_str: str, context: str, query: str) -> str:
        return Template(template_str).substitute(context=context, query=query)

    def build_prompts(self, context: str, query: str, version: Optional[str] = None) -> List[BaseMessage]:
        system_prompt_str = self._get_prompt_string("system", version)
        human_prompt_str = self._get_prompt_string("human", version)

        system_message = SystemMessage(content=self._format_prompt(system_prompt_str, context, query))
        human_message = HumanMessage(content=self._format_prompt(human_prompt_str, context, query))

        return [system_message, human_message]
