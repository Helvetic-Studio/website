# Server

Put web-application server infrastructure shared by multiple features here. Server code may import shared code but must not depend on features or the `app` layer.

Feature-specific server code should stay with its feature. Reusable technical capabilities with an independent contract may become workspace packages. See [Application architecture](../../../../docs/agents/architecture.md).
