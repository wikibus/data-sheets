PREFIX schema: <http://schema.org/>

DELETE {
  ?s schema:additionalProperty ?o .
}
INSERT {
  ?s schema:additionalProperty
      [
        a schema:PropertyValue ;
        schema:value ?o ;
      ] .
}
WHERE {
  ?s schema:additionalProperty ?o .
  FILTER (isLiteral(?o))
}
