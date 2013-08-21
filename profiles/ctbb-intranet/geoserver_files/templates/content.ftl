<#assign labels = {

  "industrial_poligons": {
    "nom": "Nom",
    "codi": "Codi",
    "m2": "Superfície (m2)",
    "dist_xv": "Distància a la xarxa viària",
    "tp_linia": "Línies de transport"
  },
  "v_comercial": {
    "nom": "Nom",
	"descripcio": "Tipus",	
	"adreca", "Adreça",	
	"ubicacio", "Ubicació",
	"telf": "Telèfon"
  },
  "v_industrial": {
    "nom": "Nom",
	"descr_ca": "Tipus",	
	"adreca_tex", "Adreça",
	"tel": "Telèfon",
	"web": "Web"
  },
  
  "cad_parce_ajuntament": {
    "adr": "Adreça",
    "rc": "Referència Cadastral",
    "reg": "Número Registre",
    "exp": "Expedients",
    "shape_area": "Àrea (m2)",
    "data_mod": "Actualització"
  },
  "plan_estudis_detall": {
    "adreca": "Codi",
    "exp": "Expedient"
  },
  "pmuni_inventari": {
    "fitxa": "Fitxa",
    "epigraf": "Epígraf",
    "etiqueta": "Tipus"
  },
  "mob_bus_parades": {
    "nom": "Nom",
    "linia": "Línia",
    "localitza": "Adreça"
  },
  "plan_cataleg_ambit": {
    "codi": "Codi",
    "numero":  "Número",
    "element": "Element",
    "descripcio": "Descripció",
    "zona": "Zona",
    "categoria": "Categoria"
  },
  "plan_cataleg_element": {
    "codi": "Codi",
    "numero": "Número",
    "element": "Element",
    "descripcio": "Descripció",
    "zona": "Zona",
    "categoria": "Categoria"
  },
  "plan_qualificacions": {
    "area_m2": "Àrea (m2)",
    "descrip1": "Descripció",
    "descrip2": "Tipus",
    "descrip3": "Subtipus",
    "codi3": "Codi",
    "link1": "Normativa",
    "link2": "Normativa complementària"
  },
  "plan_rg_sect": {
    "regim3": "Tipus",
    "desc_rs3": "Nom",
    "link_rg": "Normativa"
  },
  "plan_rg_sect2": {
    "regim2": "Tipus",
    "desc_rs2": "Nom",
    "zona": "Zona",
    "link_rg": "Normativa"
  },
  "su_hidr_hidrants_2009": {
    "codi_hidra": "Codi",
    "tipus": "Tipus",
    "situacio": "Situació",
    "diametre": "Diàmetre"
  },
  "su_net_recollida_selectiva_2009": {
    "layer": "Tipus de contenidor",
    "tipus": "Tipus de brossa",
    "capacitat": "Capacitat (l)",
    "adreça": "Adreça",
    "referencia": "Referència"
  },
  "xv_carpr": {
    "codi": "Codi",
    "nom": "Nom",
    "tipus": "Tipus",
    "titular": "Titular"
  }
}>
<ul class="layer">
  <#list features as feature>
    <li>
      <ul class="feature">
        <#if labels[type.name]??>
          <#list labels[type.name]?keys as field>
            <#if feature.attributes[field].value.trim().length() &gt; 0 >
            <#if labels[type.name][field]?contains("Normativa")>
              <li><span class='title'>${labels[type.name][field]}: </span><span class='value'><a class='gdxp_newwindow' href='documents/POUM 2008/Normatives/${feature.attributes[field].value}'>Veure normativa</a></span></li>
            <#else>
              <li><span class='title'>${labels[type.name][field]}: </span><span class='value'>${feature.attributes[field].value}</span></li>
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
