<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:se="http://www.opengis.net/se" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <se:Name>cjdcq</se:Name>
    <UserStyle>
      <se:Name>cjdcq</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>511681124000000070</se:Name>
          <se:Description>
            <se:Title>511681124000000070</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>BSM</ogc:PropertyName>
              <ogc:Literal>511681124000000070</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <!--SymbolLayerV2 GradientFill not implemented yet-->
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#803e00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>511681124000000075</se:Name>
          <se:Description>
            <se:Title>511681124000000075</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>BSM</ogc:PropertyName>
              <ogc:Literal>511681124000000075</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <!--SymbolLayerV2 GradientFill not implemented yet-->
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#803e00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name></se:Name>
          <se:Description>
            <se:Title>BSM is ''</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>BSM</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsNull>
                <ogc:PropertyName>BSM</ogc:PropertyName>
              </ogc:PropertyIsNull>
            </ogc:Or>
          </ogc:Filter>
          <!--SymbolLayerV2 GradientFill not implemented yet-->
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#803e00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
