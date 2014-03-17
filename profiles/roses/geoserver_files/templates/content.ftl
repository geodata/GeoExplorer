<#assign labels = {
  "qualificacio": {
    "QUALIF": "Qualificació",
    "ZONA": "Zona",
    "CLAU": "Normativa"
  },
  "classificacio": {
    "QUALIF": "Qualificació",
    "ZONA": "Zona",
    "CLAU": "Normativa"
  },
  "sectors": {
    "NOM": "Nom",
    "CLAU": "Normativa"
  },
  "parcela": {
    "MASA": "Massa",
    "PARCELA": "Parcel·la",
    "AREA": "Àrea (m²)",
    "REFCAT": "Referència cadastral"
  }
}>
<ul class="layer">
  <#list features as feature>
    <li>
      <ul class="feature">
        <#if labels[type.name]??>
          <#list labels[type.name]?keys as field>
            <#if feature.attributes[field].value.trim().length() &gt; 0 >
              <#if labels[type.name][field]?contains("Referència cadastral")>
                <li><span class='title'>Fotografia: </span><span class='value'><img width="70%" src="/geoserver/www/fotos_roses/${feature.attributes["MASA"].value}${feature.attributes["PARCELA"].value}.jpg"/></span></li>
              </#if>
              <#if labels[type.name][field]?contains("Normativa")>
                <li><span class='title'>${labels[type.name][field]}: </span><span class='value'><a class='gdxp_newwindow' href='documents/Normativa_POUM/${feature.attributes[field].value}.pdf'>Veure normativa</a></span></li>
              <#else>
                <li><span class='title'>${labels[type.name][field]}: </span><span class='value' id="">${feature.attributes[field].value}</span></li>
              </#if>
            </#if>
          </#list>
        <#else>
          <#list feature.attributes as attribute>
            <#if !attribute.isGeometry && attribute.value.trim().length() &gt; 0 >
              <li><span class='title'>${attribute.name}: </span><span class='value'>${attribute.value}</span></li>
            </#if>
          </#list>
        </#if>
      </ul>
    </li>
  </#list>
</ul>
