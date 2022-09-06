export const shapes = (
  start = '#999',
  end = '#999'
) => `<shapes name="mxgraph.portal">
  <!--开始-->
  <shape name="start" h="40" w="40" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.5" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <ellipse x="0" y="0" w="40" h="40"/>
      <fillstroke/>
      <fillcolor color="${start}"/>
      <path>
        <move x="15.5" y="12.8304525"/>
        <line x="15.5" y="27.212109"/>
        <line x="29.8816565" y="20.4442706"/>
        <line x="15.5" y="12.8304525"/>
      </path>
      <fill/>
    </background>
  </shape>
  <!--结束-->
  <shape name="terminal" h="40" w="40" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.5" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <ellipse x="0" y="0" w="40" h="40"/>
      <fillstroke/>
      <fillcolor color="${end}"/>
      <path>
        <rect x="15.5" y="15.5" w="10" h="10"/>
      </path>
      <fill/>
    </background>
  </shape>
  <!--任务-->
  <shape name="task" w="120" h="80" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.5" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <rect x="0" y="0" w="120" h="80"/>
      <fillstroke/>
    </background>
  </shape>
  <!--决策-->
  <!--<shape name="condition" h="80" w="100" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.5" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <path>
        <move x="0" y="40"/>
        <line x="50" y="0"/>
        <line x="100" y="40"/>
        <line x="50" y="80"/>
        <close/>
      </path>
      <fillstroke/>
    </background>
  </shape>-->
  <shape name="condition" h="68" w="114" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.5" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <path>
        <move x="0" y="34"/>
        <line x="57" y="0"/>
        <line x="114" y="34"/>
        <line x="57" y="68"/>
        <close/>
      </path>
      <fillstroke/>
    </background>
  </shape>
  <shape name="merge" h="80" w="80" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N" />
      <constraint x="0.5" y="1" perimeter="0" name="S" />
      <constraint x="0" y="0.5" perimeter="0" name="W" />
      <constraint x="1" y="0.5" perimeter="0" name="E" />
    </connections>
    <background>
      <rect x="0" y="0" w="80" h="80" />
      <fillstroke/>
    </background>
  </shape>
  <shape name="branch" h="80" w="80" aspect="variable" strokewidth="inherit">
    <connections>
        <constraint x="0.5" y="0" perimeter="0" name="N" />
        <constraint x="0.5" y="1" perimeter="0" name="S" />
        <constraint x="0" y="0.5" perimeter="0" name="W" />
        <constraint x="1" y="0.5" perimeter="0" name="E" />
    </connections>
    <background>
      <rect x="0" y="0" w="80" h="80" />
      <fillstroke/>
    </background>
  </shape>
  <!--子流程-->
  <shape name="flow" h="96" w="136" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.44" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <rect x="12" y="0" w="120" h="80"/>
      <fillstroke/>
      <rect x="6" y="6" w="120" h="80"/>
      <fillstroke color="#fff"/>
    </background>
    <foreground>
      <rect x="0" y="12" w="120" h="80"/>
      <fillstroke/>
    </foreground>
  </shape>
  <!--子流程a-->
  <shape name="flowa" h="96" w="136" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.44" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <rect x="12" y="0" w="120" h="80"/>
      <fillcolor color="#BFBFBF"/>
      <fillstroke/>
      <rect x="6" y="6" w="120" h="80"/>
      <fillcolor color="#D9D9D9"/>
      <fillstroke color="#fff"/>
    </background>
    <foreground>
      <rect x="0" y="12" w="120" h="80"/>
      <fillcolor color="#F0F0F0"/>
      <fillstroke/>
    </foreground>
  </shape>
  <!--子流程b-->
  <shape name="flowb" h="96" w="136" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.44" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <rect x="12" y="0" w="120" h="80"/>
      <fillcolor color="#122FB3"/>
      <fillstroke/>
      <rect x="6" y="6" w="120" h="80"/>
      <fillcolor color="#2148D9"/>
      <fillstroke color="#fff"/>
    </background>
    <foreground>
      <rect x="0" y="12" w="120" h="80"/>
      <fillcolor color="#3366FF"/>
      <fillstroke/>
    </foreground>
  </shape>
  <!--子流程c-->
  <shape name="flowc" h="96" w="136" aspect="variable" strokewidth="inherit">
    <connections>
      <constraint x="0.5" y="0" perimeter="0" name="N"/>
      <constraint x="0.44" y="1" perimeter="0" name="S"/>
      <constraint x="0" y="0.5" perimeter="0" name="W"/>
      <constraint x="1" y="0.5" perimeter="0" name="E"/>
    </connections>
    <background>
      <rect x="12" y="0" w="120" h="80"/>
      <fillcolor color="#ADCAFF"/>
      <opacity opacity="0.4"/>
      <fillstroke/>
      <rect x="6" y="6" w="120" h="80"/>
      <fillcolor color="#D6E6FF"/>
      <fillstroke color="#fff"/>
    </background>
    <foreground>
      <rect x="0" y="12" w="120" h="80"/>
      <fillcolor color="#F0F6FF"/>
      <fillstroke/>
    </foreground>
  </shape>
  <!-- 机器人 -->
  <shape name="robot" h="80" w="180" aspect="variable" strokewidth="inherit">
    <connections>
        <constraint x="0.5" y="0" perimeter="0" name="N" />
        <constraint x="0.5" y="1" perimeter="0" name="S" />
        <constraint x="0" y="0.5" perimeter="0" name="W" />
        <constraint x="1" y="0.5" perimeter="0" name="E" />
    </connections>
    <background>
      <rect x="0" y="0" w="180" h="80" />
      <fillstroke/>
      <image x="12" y="42" w="38" h="24" src="/static/images/bot@3x.png">
      </image>
    </background>
    <foreground>
      <fillstroke/>
    </foreground>
  </shape>
</shapes>
`
window.portalShapes = shapes()
