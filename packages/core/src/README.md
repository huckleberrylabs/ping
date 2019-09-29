# Project Structure

Entities

- contains:
  - interfaces
  - constructor
  - serializer
  - deserializer
  - typeguards
- no instantiated objects except for the entity typename
- all functional, no classes
- constructor, deserializer and serializer: errors indicate incorrectness
- typeguards: false indicates incorrectness
- no logging

Singletons

- only instantiated objects, should not contain any abstractions
- errors indicate incorrectness; program halts on incorrectness
- no logging

Structural

- combination of instantiations (ioc modules) and abstractions (deseriaizer / serializer)
- errors indicate incorrectness
- no logging
