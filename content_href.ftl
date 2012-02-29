<ul class="layer">
<#list features as feature>
  <li>  
  <ul class="feature">
  <#list feature.attributes as attribute>
	<#if !attribute.isGeometry  && (attribute.value.length() > 0) && (attribute.value != " ")>
		<#if attribute.name=="regim3">
			<li><span class='title'>Tipus:</span><span class='value'> ${attribute.value}</span></li>
		</#if>
		<#if attribute.name=="desc_rs2">
			<li><span class='title'>Nom:</span><span class='value'> ${attribute.value}</span></li>
		</#if>
                <#if attribute.name=="zona">
                        <li><span class='title'>Zona:</span><span class='value'> ${attribute.value}</span></li>
 </#if>
		<#if attribute.name=="link_rg">
			<li><span class='title'>Normativa:</span>
			<span class='value'>
			<a id='gdxp_newwindow' href='${attribute.value}'>Veure normativa</a></span></li>
			<!--<a onclick='javascript: gdxp.showHTMLDoc($(attribute.value));'>Veure normativa</a></span></li>-->
		</#if>

		<!--<li>${attribute.name}: ${attribute.value}</li>-->

		
    </#if>
  </#list>
  </ul>
  </li>
</#list>
</ul>
