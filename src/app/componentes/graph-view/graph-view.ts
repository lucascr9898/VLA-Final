import * as go from "gojs";

import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Entidade, TipoEntidade } from '../../models/entidade.model';
import { Relacao } from '../../models/relacao.model';
import { CORES_POR_TIPO, FORMA_POR_TIPO, ICONE_POR_TIPO, TODOS_OS_TIPOS, escurecerCor } from '../../shared/entidade-visual';

@Component({
  selector: 'app-graph-view',
  imports: [],
  templateUrl: './graph-view.html',
  styleUrl: './graph-view.css',
})
export class GraphView implements AfterViewInit, OnChanges {

  @Input() entidades: Entidade[] = [];
  @Input() relacoes: Relacao[] = [];
  @Input() filtroAtivo: boolean = false;

  @Output() entidadeSelecionada = new EventEmitter<string>();
  @Output() verRedeCompleta = new EventEmitter<void>();

  @ViewChild('diagramaGrafo') diagramaGrafoRef!: ElementRef;

  private diagrama!: go.Diagram;

  ngAfterViewInit(): void {
    const $ = go.GraphObject.make;

    this.diagrama = new go.Diagram(this.diagramaGrafoRef.nativeElement, {
      contentAlignment: go.Spot.Center,
      layout: $(go.ForceDirectedLayout, {
        defaultSpringLength: 80,
        defaultElectricalCharge: 100,
        isOngoing: false,
      }),
      'undoManager.isEnabled': true,
      allowZoom: true,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      minScale: 0.2,
      maxScale: 3,
      'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
      'panningTool.isEnabled': true,
    });

    TODOS_OS_TIPOS.forEach(tipo => {
      this.diagrama.nodeTemplateMap.add(tipo, this.criarTemplateNo(tipo));
    });
    this.diagrama.nodeTemplate = this.criarTemplateNo('Documento');

    this.diagrama.linkTemplate = $(go.Link,
      {
        routing: go.Routing.Normal,
        curve: go.Curve.Bezier,
        corner: 15,
      },
      $(go.Shape, { strokeWidth: 1.5, stroke: '#CBD5E1' }),
      $(go.Shape, { toArrow: 'OpenTriangle', fill: null, stroke: '#94A3B8', strokeWidth: 1.5 }),
      $(go.Panel, 'Auto',
        $(go.Shape, 'RoundedRectangle', {
          fill: '#F8FAFC',
          stroke: '#E2E8F0',
          strokeWidth: 1,
          parameter1: 4
        }),
        $(go.TextBlock,
          { margin: new go.Margin(3, 6, 3, 6), stroke: '#475569', font: '500 10px sans-serif' },
          new go.Binding('text', 'label')
        )
      )
    );

    this.diagrama.addDiagramListener('ObjectSingleClicked', (e) => {
      const part = e.subject.part;
      if (part instanceof go.Node && part.data && part.data.key) {
        this.entidadeSelecionada.emit(part.data.key);
      }
    });

    this.diagrama.model = new go.GraphLinksModel({
      linkKeyProperty: 'id',
    });

    this.atualizarModel();
  }

  private criarTemplateNo(tipo: TipoEntidade): go.Node {
    const $ = go.GraphObject.make;
    const cor = CORES_POR_TIPO[tipo];
    const forma = FORMA_POR_TIPO[tipo];
    const emoji = ICONE_POR_TIPO[tipo];

    const conteudo: go.GraphObject[] = [
      $(go.Shape, forma, {
        name: 'FORMA',
        fill: $(go.Brush, 'Linear', { 0: cor, 1: escurecerCor(cor) }),
        stroke: '#FFFFFF',
        strokeWidth: 2,
        width: 50,
        height: 50,
        cursor: 'pointer',
      }),
      $(go.TextBlock, emoji, {
        font: '20px sans-serif',
        alignment: go.Spot.Center,
      })
    ];

    return $(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        shadowColor: 'rgba(15, 23, 42, 0.08)',
        shadowOffset: new go.Point(0, 4),
        shadowBlur: 10,
        shadowVisible: true,
        selectionAdorned: false,
        cursor: 'pointer',
      },
      new go.Binding('location', 'loc', go.Point.parse),
      new go.Binding('scale', 'isSelected', (s) => s ? 1.15 : 1.0).ofObject(),

      $(go.Panel, 'Auto', ...conteudo),

      $(go.TextBlock,
        {
          margin: new go.Margin(6, 0, 0, 0),
          font: '600 11px system-ui, -apple-system, sans-serif',
          stroke: '#334155',
          alignment: go.Spot.Center,
          maxSize: new go.Size(110, NaN),
          wrap: go.Wrap.Fit
        },
        new go.Binding('text', 'label'))
    );
  }

  ngOnChanges(): void {
    if (this.diagrama) {
      this.atualizarModel();
    }
  }

  private atualizarModel(): void {
    const nodeDataArray = this.entidades.map(e => {
      const existente = this.diagrama.model.findNodeDataForKey(e.id) as { loc?: string } | null;
      const loc = existente?.loc ?? go.Point.stringify(new go.Point(Math.random() * 500, Math.random() * 400));

      return {
        key: e.id,
        label: e.label,
        category: e.type,
        loc,
      };
    });

    const linkDataArray = this.relacoes.map(r => ({
      id: r.id,
      from: r.source,
      to: r.target,
      label: r.label
    }));

    const model = this.diagrama.model as go.GraphLinksModel;

    this.diagrama.startTransaction('atualizarDados');
    model.mergeNodeDataArray(nodeDataArray);
    model.mergeLinkDataArray(linkDataArray);
    this.diagrama.commitTransaction('atualizarDados');

    this.diagrama.layoutDiagram(true);
    this.diagrama.zoomToFit();
  }

  limparGrafo(): void {
    if (!this.diagrama) {
      return;
    }
    this.diagrama.model = new go.GraphLinksModel({
      linkKeyProperty: 'id',
    });
  }

  restaurarRedeCompleta(): void {
    this.verRedeCompleta.emit();
  }
}
