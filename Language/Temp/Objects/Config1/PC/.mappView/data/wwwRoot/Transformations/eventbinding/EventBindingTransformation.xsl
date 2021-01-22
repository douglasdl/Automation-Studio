<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.br-automation.com/iat2014/eventbinding/runtime/v2"
  xmlns:binding="http://www.br-automation.com/iat2014/eventbinding/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:variable name="file" select="'./ParameterTypeMapping.xml'"></xsl:variable>
  <xsl:variable name="mappings" select="document($file)//Mappings/*"></xsl:variable>
  <!-- keep comments -->
  <xsl:template match="comment()">
    <xsl:copy>
      <xsl:apply-templates/>
    </xsl:copy>
  </xsl:template>

  <xsl:template name="copyAnyBinding">
    <!-- remove element prefix -->
    <xsl:element name="{local-name()}">
      <!-- process attributes -->
      <xsl:for-each select="@*">
        <xsl:attribute name="{name()}">
          <xsl:value-of select="."/>
        </xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!--Selects the lowest scope of EventBinding Source -->
  <xsl:template name="getSourceScope">
    <xsl:choose>
      <xsl:when test="starts-with(binding:Source/@xsi:type, 'widgets')">
        <xsl:value-of select="'content'"/>
      </xsl:when>
      <xsl:when test="starts-with(binding:Source/@xsi:type, 'session')">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="starts-with(binding:Source/@xsi:type, 'clientSystem')">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="starts-with(binding:Source/@xsi:type, 'opcUaSystem')">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="starts-with(binding:Source/@xsi:type, 'opcUa')">
        <xsl:value-of select="'plc'"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="'unknown source'"></xsl:value-of>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!--Selects the lowest scope of one or multiple targets -->
  <xsl:template name="getTargetScope">
    <xsl:param name="target"/>
    <xsl:choose>
      <xsl:when test="$target[starts-with(@xsi:type, 'widgets')]">
        <xsl:value-of select="'content'"/>
      </xsl:when>
      <xsl:when test="$target[starts-with(@xsi:type, 'clientSystem')]">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="$target[starts-with(@xsi:type, 'session')]">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="$target[starts-with(@xsi:type, 'opcUa.System')]">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="$target[starts-with(@xsi:type, 'opcUa')]">
        <xsl:value-of select="'plc'"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="'unknown target'"></xsl:value-of>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="calculateLowestScope">
    <xsl:param name="source"/>
    <xsl:param name="target"/>
    <xsl:choose>
      <xsl:when test="$source='content'">
        <xsl:value-of select="'content'"/>
      </xsl:when>
      <xsl:when test="$target='content'">
        <xsl:value-of select="'content'"/>
      </xsl:when>
      <xsl:when test="$source='session'">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="$target='session'">
        <xsl:value-of select="'session'"/>
      </xsl:when>
      <xsl:when test="$source='plc'">
        <xsl:value-of select="'plc'"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="'unknown binding'"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getScope">
    <xsl:variable name="sourceScope">
      <xsl:call-template name="getSourceScope"/>
    </xsl:variable>
    <xsl:variable name="targetScope">
      <xsl:call-template name="getTargetScope">
        <xsl:with-param name="target" select="binding:EventHandler//binding:Target | binding:Operand/binding:ReadTarget" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="bindingScope">
      <xsl:call-template name="calculateLowestScope">
        <xsl:with-param name="source" select="$sourceScope"/>
        <xsl:with-param name="target" select="$targetScope"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="$bindingScope"/>
  </xsl:template>

  <xsl:template name="getTargetContentScopeId">
    <xsl:param name="target"/>
    <xsl:choose>
      <xsl:when test="$target[starts-with(@xsi:type, 'widgets')]">
        <xsl:variable name="firstFoundId">
          <xsl:value-of select="$target[starts-with(@xsi:type, 'widgets')]/@contentRefId" />
        </xsl:variable>
        <!-- Another widgets target with another referenced conetent is not allowed! -->
        <xsl:if test="$target[starts-with(@xsi:type, 'widgets') and @contentRefId != $firstFoundId]">
          <xsl:message terminate="yes">
            Error: Two or more targets with different contents used in one EventBinding. (First: "<xsl:value-of select="$firstFoundId" />" Second: "<xsl:value-of select="$target[starts-with(@xsi:type, 'widgets') and @contentRefId != $firstFoundId]/@contentRefId" />")
            Only one content can be used in one EventBinding.
          </xsl:message>
        </xsl:if>
        <xsl:value-of select="$firstFoundId"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="''"></xsl:value-of>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getContentScopeId">
    <xsl:variable name="sourceContentScopeId">
      <xsl:choose>
        <xsl:when test="starts-with(binding:Source/@xsi:type, 'widgets')">
          <xsl:value-of select="binding:Source/@contentRefId"></xsl:value-of>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="''"></xsl:value-of>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="targetContentScopeId">
      <xsl:call-template name="getTargetContentScopeId">
        <xsl:with-param name="target" select="binding:EventHandler//binding:Target | binding:Operand/binding:ReadTarget" />
      </xsl:call-template>
    </xsl:variable>

    <xsl:choose>
      <!-- Check no id found (call template error! => check before if eventbinding references any content) -->
      <xsl:when test="$sourceContentScopeId = '' and $targetContentScopeId = ''">
        <xsl:message terminate="yes">
          Error: Failed to retrieve the content id of EventBinding.
        </xsl:message>
      </xsl:when>
      <!-- Check both have ids but they are not identical -->
      <xsl:when test="$sourceContentScopeId != '' and $targetContentScopeId != '' and $sourceContentScopeId != $targetContentScopeId">
        <xsl:message terminate="yes">
          Error: Event source is on another content ("<xsl:value-of select="$sourceContentScopeId" />") than a target referencing a content ("<xsl:value-of select="$targetContentScopeId" />") ! Only one content can be used in one EventBinding.
        </xsl:message>
      </xsl:when>
      <xsl:when test="$sourceContentScopeId != ''">
        <xsl:value-of select="$sourceContentScopeId" />
      </xsl:when>
      <xsl:when test="$targetContentScopeId != ''">
        <xsl:value-of select="$targetContentScopeId" />
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processEventBinding">
    <xsl:variable name="scope">
      <xsl:call-template name="getScope"/>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$scope='session'">
        <xsl:element name="Visualization">
          <xsl:call-template name="copyAnyBinding"/>
        </xsl:element>
      </xsl:when>
      <xsl:when test="$scope='content'">
        <xsl:element name="Content">
          <xsl:attribute name="id">
            <xsl:call-template name="getContentScopeId"/>
          </xsl:attribute>
          <xsl:call-template name="copyAnyBinding"/>
        </xsl:element>
      </xsl:when>
      <xsl:otherwise>
        <xsl:message terminate="yes">
          Error: Invalid EventBinding. EventBinding with OpcUa-Event and OpcUa-Action is not supported.
        </xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>


  <xsl:template match="binding:EventBindingSet">
    <xsl:element name="EventBindingDefinition">
      <!--process EventBindings -->
      <xsl:for-each select="./binding:Bindings/binding:EventBinding">
        <xsl:call-template name="processEventBinding"/>
      </xsl:for-each>
    </xsl:element>

  </xsl:template>

  <xsl:template match="*">
    <!-- remove element prefix -->
    <xsl:element name="{local-name()}">
      <xsl:choose>
        <!-- prefixing the refId if Elementtype Source/Target xsi:type starts with widgets-->
        <xsl:when test="(local-name() = 'Source' or local-name() = 'Target' or local-name() = 'ReadTarget' )and starts-with(@xsi:type,'widgets')">
          <xsl:call-template name="createAttributes">
            <xsl:with-param name="refId">
              <xsl:call-template name="getPrefixedId">
                <xsl:with-param name="oldId" select="@widgetRefId"></xsl:with-param>
              </xsl:call-template>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:when>
        <xsl:when test="name()='Method'">
          <xsl:call-template name="createMethodParameter"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="createAttributes"></xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="not(name()='Method')">
        <xsl:apply-templates/>
      </xsl:if>
    </xsl:element>
  </xsl:template>

  <xsl:template name="createMethodParameter">
    <xsl:variable name="methodType">
      <xsl:value-of select="@xsi:type"/>
    </xsl:variable>
    <xsl:attribute name="type">
      <xsl:value-of select="$methodType"/>
    </xsl:attribute>
    <xsl:for-each select="@*">
      <xsl:if test="not(name()='xsi:type')">
        <xsl:variable name="parameterName">
          <xsl:value-of select="local-name()"/>
        </xsl:variable>
        <xsl:variable name="mappedKey">
          <xsl:value-of select="concat($methodType, '.', $parameterName)"/>
        </xsl:variable>
        <!-- Raise error if parameter definition is missing -->
        <xsl:if test="not($mappings[@parameter=$mappedKey]/@type)">
          <xsl:message terminate="yes">
            <xsl:text>Missing Parameter definition: </xsl:text>
            <xsl:value-of select ="$mappedKey" />
          </xsl:message>
        </xsl:if>
        <xsl:variable name="mappedType">
          <xsl:value-of select ="$mappings[@parameter=$mappedKey]/@type" />
        </xsl:variable>

        <xsl:element name="Parameter">
          <xsl:attribute name="name">
            <xsl:value-of select="$parameterName"/>
          </xsl:attribute>
          <xsl:attribute name="xsi:type">
            <xsl:value-of select="$mappedType"/>
          </xsl:attribute>
          <xsl:attribute name="value">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:element>

      </xsl:if>
    </xsl:for-each>

    <xsl:for-each select="*/*">
      <xsl:variable name="parameterName">
        <xsl:value-of select="local-name()"/>
      </xsl:variable>
      <xsl:variable name="mappedKey">
        <xsl:value-of select="concat($methodType, '.', $parameterName)"/>
      </xsl:variable>
      <!-- Raise error if parameter definition is missing -->
      <xsl:if test="not($mappings[@parameter=$mappedKey]/@type)">
        <xsl:message terminate="yes">
          <xsl:text>Missing Parameter definition: </xsl:text>
          <xsl:value-of select ="$mappedKey" />
        </xsl:message>
      </xsl:if>
      <xsl:variable name="mappedType">
        <xsl:value-of select ="$mappings[@parameter=$mappedKey]/@type" />
      </xsl:variable>
      <xsl:element name="Parameter">
        <xsl:attribute name="name">
          <xsl:value-of select="$parameterName"/>
        </xsl:attribute>
        <xsl:attribute name="xsi:type">
          <xsl:value-of select="$mappedType"/>
        </xsl:attribute>
        <xsl:apply-templates/>
      </xsl:element>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="createAttributes">
    <xsl:param name="refId"></xsl:param>
    <xsl:for-each select="@*">
      <!-- DO NOT remove attribute prefix -->
      <xsl:choose>
        <!-- skip it-->
        <xsl:when test="name()='contentRefId'"/>
        <!-- use parameter refId id avaliable-->
        <xsl:when test="name()='widgetRefId' and $refId">
          <xsl:attribute name="refId">
            <xsl:value-of select="$refId"/>
          </xsl:attribute>
        </xsl:when>
        <!-- process other attributes-->
        <xsl:otherwise>
          <xsl:attribute name="{local-name()}">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>

  <!--find correct pageId and prefix the refId-->
  <xsl:template name="getPrefixedId">
    <xsl:param name="oldId"></xsl:param>
    <xsl:value-of select="@contentRefId"/>
    <xsl:text>_</xsl:text>
    <xsl:value-of select="$oldId"/>
  </xsl:template>

</xsl:stylesheet>
