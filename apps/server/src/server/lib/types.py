from typing import Any, Dict
from pydantic import BaseModel, RootModel, model_validator, ValidationInfo

VERSION_KEY_REGEX = r"^v[0-9]+$"
PRIVATE_KEY_REGEX = r"^_"
STABLE_KEY = "stable"


class PromptField(RootModel[Dict[str, Any]]):
    """
    Represents a single prompt field (system or human)
    """

    @model_validator(mode="after")
    def validate_versions(self) -> "PromptField":
        model = self.root

        if "stable" not in model:
            raise ValueError("Missing 'stable' key in prompt field")

        stable_version = model["stable"]
        if not isinstance(stable_version, str):
            raise ValueError("'stable' must be a string pointing to a version like 'v1'")

        if stable_version not in model:
            raise ValueError(f"Stable version '{stable_version}' not found in field keys")

        for key, value in model.items():
            if key == STABLE_KEY or key.startswith("_"):
                continue
            if not key.startswith("v") or not key[1:].isdigit():
                raise ValueError(f"Public version keys must match vX (invalid: {key})")
            if not isinstance(value, str):
                raise ValueError(f"Version {key} must be a string containing the prompt")

        return self

    def __getitem__(self, key):
            return self.root[key]

    def __getattr__(self, key):
        try:
            return self.root[key]
        except KeyError:
            raise AttributeError(f"{key} not found")


class PromptFile(BaseModel):
    system: PromptField
    human: PromptField
