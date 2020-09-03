import React, { MouseEvent } from "react";
import { DefaultLinkWidget, LinkWidget, PointModel } from "@projectstorm/react-diagrams";

function CustomLinkArrowWidget(props: {
  point: PointModel;
  previousPoint: PointModel;
  colour?: string;
}) {
  let { point, previousPoint, colour } = props;

  let diffX = point.getPosition().x - previousPoint.getPosition().x;
  let diffY = point.getPosition().y - previousPoint.getPosition().y;
  let angle = 90 + (Math.atan2(diffY, diffX) * 180) / Math.PI;

  let coef = 0.15;
  let translateX = point.getPosition().x - diffX * coef;
  let translateY = point.getPosition().y - diffY * coef;
  return (
    <g className="arrow" transform={`translate(${translateX}, ${translateY})`}>
      <g style={{ transform: "rotate(" + angle + "deg)" }}>
        <g transform={"translate(0, -3)"}>
          <polygon
            points="0,10 8,30 -8,30"
            fill={colour}
            data-id={point.getID()}
            data-linkid={point.getLink().getID()}></polygon>
        </g>
      </g>
    </g>
  );
}

class ArrowLinkWidget extends DefaultLinkWidget {
  generateArrow(point: PointModel, previousPoint: PointModel) {
    return (
      <CustomLinkArrowWidget
        key={point.getID()}
        point={point}
        previousPoint={previousPoint}
        colour={this.props.link.getOptions().color}
      />
    );
  }
  render() {
    //ensure id is present for all points on the path
    let points = this.props.link.getPoints();
    let paths = [];
    this.refPaths = [];
    console.log(points);

    //draw the multiple anchors and complex line instead
    for (let j = 0; j < points.length - 1; j++) {
      paths.push(
        this.generateLink(
          LinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            "data-linkid": this.props.link.getID(),
            "data-point": j,
            onMouseDown: (event: MouseEvent) => {
              this.addPointToLink(event, j + 1);
            },
          },
          j,
        ),
      );
    }

    //render the circles
    for (let i = 1; i < points.length - 1; i++) {
      paths.push(this.generatePoint(points[i]));
    }

    if (this.props.link.getTargetPort() !== null) {
      paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
    } else {
      paths.push(this.generatePoint(points[points.length - 1]));
    }

    return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
  }
}

export default ArrowLinkWidget;
