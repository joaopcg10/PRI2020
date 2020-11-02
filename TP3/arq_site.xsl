<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:result-document href="arq/index.html">
            <html>
                <head>
                    <title> Arqueossítios </title>
                </head>
                <body>

                    <a name="indice"/>
                    
                    <h3 style="margin-left: 20px">Índice</h3>
                    <ol>
                        <xsl:apply-templates mode="indice" select="//ARQELEM"/>                    
                    </ol>
                            
                    <xsl:apply-templates select="//ARQELEM"/>
                                
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
    <!-- Templates para o índice ______________________________________________________________________-->
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/>
            <a href="{generate-id()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <!-- Templates para o conteúdo ____________________________________________________________________-->
    <xsl:template match="ARQELEM">
        <xsl:result-document href="arq/{generate-id()}.html">
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <div style="margin-left: 10px">
                        <table width="99%" border="1" style="margin-top: 10px; border-collapse:collapse;">
                            <tr>
                                <td width="47.5%">
                                    <p><b>Identidade</b>: <xsl:value-of select="IDENTI"/></p>  
                                    <p><b>Lugar</b>: <xsl:value-of select="LUGAR"/></p>
                                    <p><b>Freguesia</b>: <xsl:value-of select="FREGUE"/></p>
                                    <p><b>Concelho</b>: <xsl:value-of select="CONCEL"/></p>
                                </td>
                                <td>
                                    <xsl:if test="CODADM">
                                        <p><b>Código</b>: <xsl:value-of select="CODADM"/></p>
                                    </xsl:if>                     
                                    <xsl:if test="LONGIT">
                                        <p><b>Longitude</b>: <xsl:value-of select="LONGIT"/></p>
                                    </xsl:if>                      
                                    <xsl:if test="LATITU">
                                        <p><b>Latitude</b>: <xsl:value-of select="LATITU"/></p>
                                    </xsl:if>                        
                                    <xsl:if test="ALTITU">
                                        <p><b>Altitude</b>: <xsl:value-of select="ALTITU"/></p>
                                    </xsl:if>
                                </td>
                            </tr>
                        </table>
                        
                        
                        <xsl:if test="DESCRI">
                            <p><b>Descrição</b>: <xsl:value-of select="DESCRI"/></p>
                        </xsl:if>
                        
                        <xsl:if test="CRONO">
                            <p><b>Cronologia</b>: <xsl:value-of select="CRONO"/></p>
                        </xsl:if>
                        
                        
                        
                        <xsl:if test="ACESSO">
                            <p><b>Acesso</b>: <xsl:value-of select="ACESSO"/></p>
                        </xsl:if>
                        
                        <xsl:if test="QUADRO">
                            <p><b>Quadro</b>: <xsl:value-of select="QUADRO"/></p>
                        </xsl:if>
                        
                        
                        
                        <xsl:if test="TRAARQ">
                            <p><b>Trabalho arqueológico</b>: <xsl:value-of select="TRAARQ"/></p>
                        </xsl:if>
                        
                        <p><b>Descrição arqueológica</b>: <xsl:value-of select="DESARQ"/></p>
                        
                        <xsl:if test="INTERP">
                            <p><b>INTERP</b>: <xsl:value-of select="INTERP"/></p>
                        </xsl:if>
                        
                        <xsl:if test="INTERE">
                            <p><b>INTERE</b>: <xsl:value-of select="INTERE"/></p>
                        </xsl:if>
                        
                        <xsl:if test="DEPOSI">
                            <p><b>Depósito</b>: <xsl:value-of select="DEPOSI"/></p>
                        </xsl:if>
                        
                        
                        <p><b>Bibliografia:</b></p>
                        <ol>
                            <xsl:for-each select="BIBLIO">
                                <li>
                                    <xsl:value-of select="."/>
                                </li>
                            </xsl:for-each>
                        </ol>
                        
                        
                        
                        <p style="text-align: right"><xsl:value-of select="AUTOR"/><br/><xsl:value-of select="DATA"/></p>
                        
                        
                        
                        <address>[<a href="index.html#i{generate-id()}">Voltar ao índice</a>]</address>
                    </div>
                    
                    <center>
                        <hr width="100%" style="border: 1px solid black;"/>
                    </center>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>