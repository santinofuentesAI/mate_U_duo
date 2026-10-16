import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';

test('interactive proofbuilder questions validate premise chains', () => {
  const proofQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'proofbuilder');
  
  assert.ok(proofQuestions.length >= 3, `Found ${proofQuestions.length} proofbuilder questions`);
  
  for (const q of proofQuestions) {
    assert.ok(q.premises, `${q.id} should have premises`);
    assert.ok(Array.isArray(q.premises), `${q.id} premises should be array`);
    assert.ok(q.premises.length > 0, `${q.id} should have at least one premise`);
    assert.ok(q.answer, `${q.id} should have target conclusion`);
    assert.ok((q as any).validSteps, `${q.id} should have validSteps`);
    assert.ok(Array.isArray((q as any).validSteps), `${q.id} validSteps should be array`);
  }
});

test('interactive truth table questions have valid expressions and variables', () => {
  const tableQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'interactive-table');
  
  assert.ok(tableQuestions.length >= 3, `Found ${tableQuestions.length} interactive-table questions`);
  
  for (const q of tableQuestions) {
    assert.ok(q.expression, `${q.id} should have expression`);
    assert.ok(q.variables, `${q.id} should have variables`);
    assert.ok(Array.isArray(q.variables), `${q.id} variables should be array`);
    assert.ok(q.variables.length > 0, `${q.id} should have at least one variable`);
    // Expression should contain all variables
    for (const v of q.variables) {
      assert.ok(q.expression.includes(v), `${q.id} expression should contain variable ${v}`);
    }
  }
});

test('order-steps questions have steps and correct order', () => {
  const orderQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'order-steps');
  
  assert.ok(orderQuestions.length >= 3, `Found ${orderQuestions.length} order-steps questions`);
  
  for (const q of orderQuestions) {
    const steps = (q as any).steps;
    const correctOrder = (q as any).correctOrder;
    
    assert.ok(steps, `${q.id} should have steps`);
    assert.ok(Array.isArray(steps), `${q.id} steps should be array`);
    assert.ok(steps.length >= 2, `${q.id} should have at least 2 steps`);
    assert.ok(correctOrder, `${q.id} should have correctOrder`);
    assert.ok(Array.isArray(correctOrder), `${q.id} correctOrder should be array`);
    assert.equal(correctOrder.length, steps.length, `${q.id} correctOrder length should match steps`);
    // All indices should be valid
    for (const idx of correctOrder) {
      assert.ok(idx >= 0 && idx < steps.length, `${q.id} order index ${idx} should be valid`);
    }
  }
});

test('sort-cards questions have cards and buckets with correct assignments', () => {
  const sortQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'sort-cards');
  
  assert.ok(sortQuestions.length >= 3, `Found ${sortQuestions.length} sort-cards questions`);
  
  for (const q of sortQuestions) {
    const cards = (q as any).cards;
    const buckets = (q as any).buckets;
    
    assert.ok(cards, `${q.id} should have cards`);
    assert.ok(Array.isArray(cards), `${q.id} cards should be array`);
    assert.ok(cards.length > 0, `${q.id} should have at least one card`);
    assert.ok(buckets, `${q.id} should have buckets`);
    assert.ok(Array.isArray(buckets), `${q.id} buckets should be array`);
    assert.ok(buckets.length >= 2, `${q.id} should have at least 2 buckets`);
    
    // Check all cards are assigned to exactly one bucket
    const allAssigned = buckets.flatMap((b: any) => b.correctCards);
    assert.equal(new Set(allAssigned).size, allAssigned.length, `${q.id} no duplicate assignments`);
    assert.equal(allAssigned.length, cards.length, `${q.id} all cards should be assigned`);
    
    // All indices should be valid
    for (const idx of allAssigned) {
      assert.ok(idx >= 0 && idx < cards.length, `${q.id} card index ${idx} should be valid`);
    }
  }
});

test('interactive-venn questions have sets, operation, and correct regions', () => {
  const vennQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'interactive-venn');
  
  assert.ok(vennQuestions.length >= 3, `Found ${vennQuestions.length} interactive-venn questions`);
  
  for (const q of vennQuestions) {
    const sets = (q as any).sets;
    const operation = (q as any).operation;
    const correctRegions = (q as any).correctRegions;
    
    assert.ok(sets, `${q.id} should have sets`);
    assert.ok(Array.isArray(sets), `${q.id} sets should be array`);
    assert.ok(sets.length === 2 || sets.length === 3, `${q.id} should have 2 or 3 sets`);
    assert.ok(operation, `${q.id} should have operation`);
    assert.ok(typeof operation === 'string', `${q.id} operation should be string`);
    assert.ok(correctRegions, `${q.id} should have correctRegions`);
    assert.ok(Array.isArray(correctRegions), `${q.id} correctRegions should be array`);
    assert.ok(correctRegions.length > 0, `${q.id} should have at least one correct region`);
    
    // Each set should have label and color
    for (const set of sets) {
      assert.ok(set.label, `${q.id} set should have label`);
      assert.ok(set.color, `${q.id} set should have color`);
    }
  }
});

test('graph-slider questions have function type and target parameters', () => {
  const sliderQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'graph-slider');
  
  assert.ok(sliderQuestions.length >= 3, `Found ${sliderQuestions.length} graph-slider questions`);
  
  for (const q of sliderQuestions) {
    const functionType = (q as any).functionType;
    const targetParams = (q as any).targetParams;
    const tolerance = (q as any).tolerance;
    
    assert.ok(functionType, `${q.id} should have functionType`);
    assert.ok(['quadratic', 'linear', 'cubic', 'rational'].includes(functionType), 
      `${q.id} functionType should be valid`);
    assert.ok(targetParams, `${q.id} should have targetParams`);
    assert.ok(typeof targetParams.a === 'number', `${q.id} should have parameter a`);
    assert.ok(typeof targetParams.b === 'number', `${q.id} should have parameter b`);
    assert.ok(typeof targetParams.c === 'number', `${q.id} should have parameter c`);
    assert.ok(typeof tolerance === 'number', `${q.id} should have tolerance`);
    assert.ok(tolerance > 0, `${q.id} tolerance should be positive`);
  }
});

test('match-graphs questions have graphs and correct matches', () => {
  const matchQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => q.type === 'match-graphs');
  
  assert.ok(matchQuestions.length >= 3, `Found ${matchQuestions.length} match-graphs questions`);
  
  for (const q of matchQuestions) {
    const graphs = (q as any).graphs;
    const correctMatches = (q as any).correctMatches;
    
    assert.ok(graphs, `${q.id} should have graphs`);
    assert.ok(Array.isArray(graphs), `${q.id} graphs should be array`);
    assert.ok(graphs.length >= 2, `${q.id} should have at least 2 graphs`);
    assert.ok(correctMatches, `${q.id} should have correctMatches`);
    assert.ok(typeof correctMatches === 'object', `${q.id} correctMatches should be object`);
    
    // Each graph should have id, equation, and points
    for (const graph of graphs) {
      assert.ok(graph.id, `${q.id} graph should have id`);
      assert.ok(graph.equation, `${q.id} graph should have equation`);
      assert.ok(graph.points, `${q.id} graph should have points`);
      assert.ok(Array.isArray(graph.points), `${q.id} graph points should be array`);
      assert.ok(graph.points.length > 0, `${q.id} graph should have point data`);
      
      // Check match exists
      assert.ok(correctMatches[graph.id], `${q.id} should have match for graph ${graph.id}`);
      assert.equal(correctMatches[graph.id], graph.equation, 
        `${q.id} match for ${graph.id} should equal its equation`);
    }
  }
});

test('all interactive questions have proper topic assignment', () => {
  const interactiveTypes = ['proofbuilder', 'interactive-table', 'order-steps', 'sort-cards', 
                             'interactive-venn', 'graph-slider', 'match-graphs'];
  
  const interactiveQuestions = lessons
    .flatMap(l => l.questions)
    .filter(q => interactiveTypes.includes(q.type));
  
  assert.ok(interactiveQuestions.length >= 21, `Found ${interactiveQuestions.length} interactive questions`);
  
  for (const q of interactiveQuestions) {
    assert.ok(q.topic, `${q.id} should have topic for mastery tracking`);
    assert.ok(q.difficulty, `${q.id} should have difficulty`);
    assert.ok([1, 2, 3].includes(q.difficulty), `${q.id} difficulty should be 1, 2, or 3`);
    assert.ok(q.hints, `${q.id} should have hints array`);
    assert.ok(Array.isArray(q.hints), `${q.id} hints should be array`);
    assert.ok(q.explanation, `${q.id} should have explanation`);
  }
});
