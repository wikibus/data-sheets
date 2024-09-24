PREFIX schema: <http://schema.org/>

DELETE {
  ?parent ?prop ?minQuantitativeValue .
  ?parent ?prop ?maxQuantitativeValue .
  ?minQuantitativeValue ?pMin ?oMin .
  ?maxQuantitativeValue ?pMax ?oMax .
} INSERT {
    ?parent ?prop ?minMax .
    ?minMax
      schema:minValue ?minValue ;
      schema:maxValue ?maxValue ;
      ?pMin ?oMin ;
      ?pMax ?oMax ;
    .
  }
WHERE {
  ?parent ?prop ?minQuantitativeValue .
  ?parent ?prop ?maxQuantitativeValue .
  ?minQuantitativeValue schema:minValue ?minValue .
  ?maxQuantitativeValue schema:maxValue ?maxValue .
  ?minQuantitativeValue ?pMin ?oMin .
  ?maxQuantitativeValue ?pMax ?oMax .

  BIND (bnode("minMax") AS ?minMax)
}
