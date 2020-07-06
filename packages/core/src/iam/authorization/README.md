In all cases where want to check Access, we will have at minimum an Agent and an Action. In most cases, we will also have an Object. What we want to check is the existance of at least one policy which grants access. These policies are of varying specificity.

The default is no access (no policies), and exceptions (all but X) are not possible. Instead we can have sets and extensions. Sets of Actions, Sets of Entities, Sets of Agents. Extensions are Policy "Traversals" - if Account owns X and X owns Y then Account owns Y.

## TODO

- Access Log
- Access Policy Change Log
