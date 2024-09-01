PREFIX schema: <http://schema.org/>

DELETE {
  ?quantitativeValue ?p ?nested .
  ?nested
    a schema:QuantitativeValue ;
      schema:value ?value ;
      schema:unitCode ?unit .
}
INSERT {
  ?quantitativeValue ?p ?value .
  ?quantitativeValue schema:unitCode ?unit .
}
WHERE {
  ?quantitativeValue
    a schema:QuantitativeValue ;
    ?p ?nested .

  ?nested
    a schema:QuantitativeValue ;
    schema:value ?value ;
  .

  OPTIONAL {
    ?nested schema:unitCode ?unit .
  }
}
