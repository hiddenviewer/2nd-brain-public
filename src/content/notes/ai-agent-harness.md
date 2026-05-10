---
title: AI Agent Harness
description: A visual note on how harnesses turn LLMs from chat interfaces into observable, repeatable work systems.
category: ai
noteType: visual-note
status: published
featured: true
updated: 2026-05-10
confidence: medium
tags: [ai-agents, harness, workflow, evaluation]
sources:
  - label: Agent harness notes from private second brain
  - label: Claude Code and multi-agent workflow notes
---

## Core Question

How do you make an AI agent more reliable than a one-off chat session?

The useful answer is not "use a stronger model" alone. The more durable answer is to build a harness around the model: context preparation, tool boundaries, execution loops, observation, evaluation, and recovery.

## Mental Model

An agent harness is the operating layer around an LLM.

It decides what context the model sees, which tools it can call, how work is checked, when humans are asked, and how results become durable knowledge.

## System View

| Layer | Role | Failure Mode If Missing |
| --- | --- | --- |
| Context | Supplies task, files, memory, constraints | The model solves the wrong problem |
| Tools | Give the model controlled actions | The model can only describe work |
| Loop | Turns intent into repeated progress | Long tasks stall after one response |
| Observation | Captures logs, diffs, tests, traces | Failures are invisible |
| Evaluation | Checks output against standards | Bad work looks complete |
| Memory | Preserves useful lessons | Each session starts cold |

## Practical Pattern

1. Define the goal in operational terms.
2. Load only the context needed for the current step.
3. Let the agent act through constrained tools.
4. Inspect outputs with tests, logs, review, or screenshots.
5. Store the useful result back into the knowledge system.

## Why This Matters

The harness is where quality compounds. A model upgrade can improve single-step ability, but a harness improves the whole work system: repeatability, debuggability, traceability, and handoff.

## Design Heuristic

If an agent task cannot be observed, it cannot be improved. If it cannot be evaluated, it cannot be trusted.
