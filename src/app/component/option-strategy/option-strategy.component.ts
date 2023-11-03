import { Component, ElementRef } from '@angular/core';
import { AuthenticationService, OptionStrategyService } from '../../services';
import { FormBuilder, FormGroup} from '@angular/forms';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { CustomMap } from 'src/app/helpers';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as d3 from "d3";


@Component({
  selector: 'app-option-strategy',
  templateUrl: './option-strategy.component.html',
  styleUrls: ['./option-strategy.component.scss']
})

export class OptionStrategyComponent {

  constructor(private optionStrategyService: OptionStrategyService, private authService: AuthenticationService, private formBuilder: FormBuilder, private el: ElementRef) {

  }
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public panes = [
    { name: 'Home 01', id: 'tab-01' },
    { name: 'Profile 02', id: 'tab-02' },
    { name: 'Contact 03', id: 'tab-03' }
  ];
  activePane = 0;
  faHandPointRight = faCircle;
  records: any[] = [];
  page: number = 1;
  tableSize: number = 10;
  count: number = 0;
  nodeMap = new Map();
  linkedNode: string = '';
  optionUpdateForm: FormGroup | undefined;
  currentNode: number = 0;
  positions = new CustomMap<string, any>();
  public chart: any;
  formPositons = new Map();
  months: any = [];
  chartBarData: any = [];
  selectedTableRow: string = '';

  tableRows: any = [];

  ngOnInit() {
    this.authService.checkActiveLogin().subscribe();
    this.getList({ page: 1 });
    this.optionUpdateForm = this.formBuilder.group({
      parent: '', ticker: '', stock_price: '',
      risk_free_rate: '', days_from_today: '', interval: '',
      start_date: '', cash: '', active: '', cash_in_hand: '',
      parentTradeCost: '', extra_cash: ''
    });
  }

  getList(params: any) {
    this.optionStrategyService.list(params).subscribe((resp: any) => {
      if (resp.success == true) {
        this.records = resp.data.parents;
        this.page = resp.data.currentPage;
        this.count = resp.data.total;
        resp.data.nodes.forEach((item: any) => {
          const key = parseInt(Object.keys(item)[0]);
          const value = item[key];
          this.nodeMap.set(key, value);
        });
      }
    })
  }

  getStatus(status: number) {
    let ret;
    if (status == 1) ret = '<span class="badge ms-auto badge-sm bg-success">Yes</span>';
    if (status == 0) ret = '<span class="badge ms-auto badge-sm bg-warning">No</span>';
    if (status == 2) ret = '<span class="badge ms-auto badge-sm bg-danger">Expired</span>';
    return ret;
  }

  onTableDataChange(event: number) {
    this.getList({ page: event });
  }

  separateChilds(childs: string) {
    const children = childs.split(",");
    const result: any = [];

    children.forEach((item: any) => {
      const nodes = item.split('-');
      const childType = parseInt(nodes[2], 10);

      result.push({
        type: childType,
        node: nodes[0],
        name: nodes[1],
      });
    });
    return result;
  }

  viewTicker(id: any) {
    this.getFormData();
    this.activePane = 1;
    this.currentNode = id
    this.optionStrategyService.getOptionStrategy(id).subscribe((resp: any) => {
      if (resp.success == true) {
        this.linkedNode = resp.allNodes.childs;
        this.positions.clear();
        resp.data.option_strategy_position_dups.forEach((obj: any) => {
          this.positions.set(obj.row_id, obj);
        });
        this.optionUpdateForm?.setValue({
          parent: resp.data.parent_id,
          ticker: resp.data.ticker,
          stock_price: resp.data.current_stock_price,
          risk_free_rate: resp.data.risk_free_rate,
          days_from_today: resp.data.days_from_today,
          interval: resp.data.default_interval,
          start_date: resp.data.start_date,
          cash: resp.data.cash,
          active: resp.data.is_active,
          cash_in_hand: resp.data.cash_in_hand,
          parentTradeCost: '',
          extra_cash: resp.data.extra_cash
        });
        this.createTreeChart(resp.hierarchy);
        this.populatedTable(resp);
      }
    })
  }

  populatedTable(resp: any) {
    this.tableRows = {}
    const formData = this.getFormData();
    formData.positions = this.positions.getEntries();
    this.optionStrategyService.analyserStrategy(this.currentNode, formData).subscribe((resp: any) => {
      this.tableRows = resp;
      this.initCharts(resp.data.row1, resp.data.netpl);
      this.selectedTableRow = 'netpl';
    })
  }

  onTabChange($event: number) {
    this.activePane = $event;
  }

  removePosition(rowId: string) {
    this.positions.delete(rowId);
  }

  addNewPosition() {
    const key = this.makeid(5);
    this.positions.set(key, { row_id: key });
  }

  makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  initCharts(row1: any, row2: any): void {
    this.months = [row1.l10, row1.l9, row1.l8, row1.l7, row1.l6, row1.l5, row1.l4, row1.l3, row1.l2, row1.l1, row1.sp, row1.h1, row1.h2, row1.h3, row1.h4, row1.h5, row1.h6, row1.h7, row1.h8, row1.h9, row1.h10];
    this.chartBarData = {
      labels: [...this.months],
      datasets: [
        {
          label: 'Profit',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            row2.l10, row2.l9, row2.l8, row2.l7, row2.l6, row2.l5, row2.l4, row2.l3, row2.l2, row2.l1, row2.sp, row2.h1, row2.h2, row2.h3, row2.h4, row2.h5, row2.h6, row2.h7, row2.h8, row2.h9, row2.h10
          ],
        }
      ]
    };
  }

  getFormData() {
    return this.optionUpdateForm?.value;
  }

  getObjectProperties(obj: any): { key: string, value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  setTableRowSelected(e: any) {
    this.selectedTableRow = e.target.value;
    e.target.checked = true;
    if (this.selectedTableRow == 'netpl') {
      this.initCharts(this.tableRows.data.row1, this.tableRows.data.netpl);
    } else if (this.selectedTableRow == 'nav') {
      this.initCharts(this.tableRows.data.row1, this.tableRows.data.row2);
    } else {
      let row = this.tableRows.data.row11[this.selectedTableRow];
      let row2: { [key: string]: any } = {}
      row = Object.entries(row);
      for (let [key, value] of row) {
        row2[key] = value.total;
      }
      this.initCharts(this.tableRows.data.row1, row2);
    }

  }

  createTreeChart1(hierarchicalData: any): void {
    d3.select(this.el.nativeElement)
      .select('.tree-container')
      .select('svg')
      .remove();

    const root = d3.hierarchy<any>(hierarchicalData);

    let maxNodeX = 0;

    root.descendants().forEach((d: any) => {
      maxNodeX++;
    });

    // Add some padding
    if (maxNodeX < 10) {
      maxNodeX = 800;
    } else {
      maxNodeX = maxNodeX * 70;
    }
    const treeLayout = d3.tree()
      .size([500, maxNodeX - 100])
      .separation((a, b) => (a.parent === b.parent ? 2 : 2.5)); // Adjust the separation value

    this.svg = d3.select(this.el.nativeElement).select('.tree-container')
      .append('svg')
      .attr('width', maxNodeX)
      .attr('height', 600);
    // Compute the layout
    treeLayout(root);

    const diagonal = d3
      .linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    const customDiagonal = d3
      .linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => {
        if (d.parent) {
          if (d.data.price > d.parent.data.price) {
            return d.x; // Move up
          } else if (d.data.price < d.parent.data.price) {
            return d.x; // Move down
          }
        }
        return d.x;
      });

    this.svg.selectAll("path.link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d: any) => customDiagonal(d) || "");

    this.svg
      .selectAll("circle.node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("class", (d: any) => {
        if (d.data.active == "1") {
          return "node-act";
        } else if (d.data.active == "0") {
          return "node-nact";
        } else {
          return "node-exp";
        }
      })
      .attr("cx", (d: any) => d.y + 2)
      .attr("cy", (d: any) => {
        // Adjust the vertical position based on price compared to parent
        if (d.parent) {
          if (d.data.price > d.parent.data.price) {
            return d.x; // Move up
          } else if (d.data.price < d.parent.data.price) {
            return d.x; // Move down
          }
        }
        return d.x; // Default position
      })

      .attr("r", 6);

    this.svg
      .selectAll("text.label")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d: any) => d.y + 10)
      .attr("y", (d: any) => d.x - 10)
      .text((d: any, i: number) => (i === 0 ? d.data.name : ""));

    this.svg.selectAll("text.price-label")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "price-label")
      .attr("x", (d: any) => d.y + 10)
      .attr("y", (d: any) => d.x + 5)
      .text(d => d.data.price);

    this.svg.selectAll("text.pl-label")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "pl-label")
      .attr("x", (d: any) => d.y + 10)
      .attr("y", (d: any) => d.x + 15)
      .text(d => d.data.pl_percent + '%');

    this.svg.selectAll("text.date-label")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "date-label")
      .attr("x", (d: any) => d.y + 10)
      .attr("y", (d: any) => d.x + 25)
      .text(d => d.data.start_date);

  }

  createTreeChart(jsonData: any): void {
    d3.select(this.el.nativeElement)
      .select('.tree-container')
      .select('svg')
      .remove();

    var green = '#009600',
      yellow = '#ffd700',
      red = '#FC0000';
    var margin = {
      top: 0,
      right: 0,
      bottom: 100,
      left: 0
    },
      width = 800 - margin.right - margin.left,
      height = 400 - margin.top - margin.bottom;
    var rectNode = { width: 120, height: 60, textMargin: 5 },
      tooltip = { width: 150, height: 40, textMargin: 5 };
    var i = 0,
      duration = 750,
      root: any;
    var mousedown;
    var mouseWheel,
      mouseWheelName,
      isKeydownZoom = false;
    var tree: any;
    var baseSvg,
      svgGroup,
      nodeGroup: any,
      linkGroup: any,
      linkGroupToolTip: any,
      defs: any;

    init(jsonData);

    function init(jsonData: any) {
      if (jsonData)
        drawTree(jsonData);
      else {
        console.error(jsonData);
        alert('Invalides data.');
      }
    }

    function drawTree(jsonData: any) {
      tree = d3.tree().size([height, width]); /////
      root = d3.hierarchy(jsonData);
      //root.fixed = true; ////
      var maxDepth = 0;
      var maxTreeWidth = breadthFirstTraversal(tree(root).descendants(), function (currentLevel: any) {
        maxDepth++;
        currentLevel.forEach(function (node: any) {
          if (node.active == '1')
            node.color = green;
          if (node.active == '0')
            node.color = yellow;
          if (node.active == '2')
            node.color = red;
        });
      });
      height = maxTreeWidth * (rectNode.height + 20) + tooltip.height + 20 - margin.right - margin.left;
      width = maxDepth * (rectNode.width * 1.5) + tooltip.width / 2 - margin.top - margin.bottom;
      root.x0 = height / 2;
      root.y0 = 0;

      baseSvg = d3.select('#tree-container').append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'svgContainer');


      svgGroup = baseSvg.append('g')
        .attr('class', 'drawarea')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      nodeGroup = svgGroup.append('g')
        .attr('id', 'nodes');
      linkGroup = svgGroup.append('g')
        .attr('id', 'links');
      linkGroupToolTip = svgGroup.append('g')
        .attr('id', 'linksTooltips');


      defs = baseSvg.append('defs');
      initArrowDef();
      update(root);
    }

    function update(source: any) {
      let treeLayout = tree(root);
      var nodes = treeLayout.descendants(),
        links = treeLayout.links(nodes);
      breadthFirstTraversal(nodes, collision);
      nodes.forEach(function (d: any) {
        d.y = d.depth * (rectNode.width * 1.5);
      });

      // 1) ******************* Update the nodes *******************
      var node = nodeGroup.selectAll('g.node').data(nodes, function (d: any) {
        return d.id || (d.id = ++i);
      });


      var nodeEnter = node.enter().insert('g', 'g.node')
        .attr('class', function (d: any) {
          var nodeClass = '';
          if (d.data.active === '1') {
            nodeClass += ' node-act';
          } else if (d.data.active === '0') {
            nodeClass += ' node-nact';
          } else if (d.data.active === '2') {
            nodeClass += ' node-exp';
          }
          return nodeClass;
        })
       .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; })
      nodeEnter.append('g').append('rect')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('width', rectNode.width)
        .attr('height', rectNode.height)
        .attr('class', 'node-rect')
        .attr('fill', function (d: any) { return d.color; })
        .attr('filter', 'url(#drop-shadow)');

      nodeEnter.append('foreignObject')
        .attr('x', rectNode.textMargin)
        .attr('y', rectNode.textMargin)
        .attr('width', function () {
          return (rectNode.width - rectNode.textMargin * 2) < 0 ? 0
            : (rectNode.width - rectNode.textMargin * 2)
        })
        .attr('height', function () {
          return (rectNode.height - rectNode.textMargin * 2) < 0 ? 0
            : (rectNode.height - rectNode.textMargin * 2)
        })
        .append('xhtml').html(function (d: any) {
          return '<div style="width: '
            + (rectNode.width - rectNode.textMargin * 2) + 'px; height: '
            + (rectNode.height - rectNode.textMargin * 2) + 'px;" class="node-text wordwrap">'
            + '<b>' + d.data.name + '</b><br>'
            + '<b>Price: </b>' + d.data.price + '<br>'
            + '<b>P/L %: </b>' + d.data.pl_percent + '<br>'
            + '<b>Date: </b>' + d.data.start_date + '<br>'
            + '</div>';
        })


      // Transition nodes to their new position.
      var nodeUpdate = node.transition().duration(duration)
        .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

      nodeUpdate.select('rect')
        .attr('class', function (d: any) { return d._children ? 'node-rect-closed' : 'node-rect'; });

      nodeUpdate.select('text').style('fill-opacity', 1);


      // 2) ******************* Update the links *******************
      var link = linkGroup.selectAll('path').data(links, function (d: any) {
        return d.target.id;
      });


      var linkenter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('id', function (d: any) { return 'linkID' + d.target.id; })
        .attr('d', function (d: any) { return diagonal(d); })
        .attr('marker-end', 'url(#end-arrow)');


      // Transition links to their new position.
      var linkUpdate = link.transition().duration(duration)
        .attr('d', function (d: any) { return diagonal(d); });

    }

    function breadthFirstTraversal(tree: any, func: any) {
      var max = 0;
      if (tree && tree.length > 0) {
        var currentDepth = tree[0].depth;
        var fifo = [];
        var currentLevel = [];

        fifo.push(tree[0]);
        while (fifo.length > 0) {
          var node: any = fifo.shift();
          if (node.depth > currentDepth) {
            func(currentLevel);
            currentDepth++;
            max = Math.max(max, currentLevel.length);
            currentLevel = [];
          }
          currentLevel.push(node);
          if (node.children) {
            for (var j = 0; j < node.children.length; j++) {
              fifo.push(node.children[j]);
            }
          }
        }
        func(currentLevel);
        return Math.max(max, currentLevel.length);
      }
      return 0;
    }

    function collision(siblings: any) {
      var minPadding = 5;
      if (siblings) {
        for (var i = 0; i < siblings.length - 1; i++) {
          if (siblings[i + 1].x - (siblings[i].x + rectNode.height) < minPadding)
            siblings[i + 1].x = siblings[i].x + rectNode.height + minPadding;
        }
      }
    }    
    
    function diagonal(d: any) {
      var p0: any = {
        x: d.source.x + rectNode.height / 2,
        y: (d.source.y + rectNode.width)
      }, p3 = {
        x: d.target.x + rectNode.height / 2,
        y: d.target.y - 12 // -12, so the end arrows are just before the rect node
      }, m = (p0.y + p3.y) / 2, p = [p0, {
        x: p0.x,
        y: m
      }, {
          x: p3.x,
          y: m
        }, p3];
      p = p.map(function (d) {
        return [d.y, d.x];
      });
      return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
    }
    function initArrowDef() {
      // Build the arrows definitions
      // End arrow
      defs.append('marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrow')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

      // End arrow selected
      defs.append('marker')
        .attr('id', 'end-arrow-selected')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrowselected')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

      // Start arrow
      defs.append('marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrow')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5');

      // Start arrow selected
      defs.append('marker')
        .attr('id', 'start-arrow-selected')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrowselected')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5');
    }
  }


}
