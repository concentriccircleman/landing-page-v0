import React from "react";
import { Button } from "../Button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../Breadcrumb";
import { ChevronLeft as ChevronLeftIcon } from "../../icons/outline";
import styles from "./TopBar.module.css";

export interface TopBarCrumb {
  label: string;
  onClick?: () => void;
}

export interface TopBarProps {
  breadcrumbs: TopBarCrumb[];
  actions?: React.ReactNode;
}

export function TopBar({ breadcrumbs, actions }: TopBarProps) {
  const hasBack = breadcrumbs.length > 1;
  const parentCrumbs = breadcrumbs.slice(0, -1);
  const currentCrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        {hasBack && (
          <Button
            variant="secondary"
            size="icon"
            className={styles.backButton}
            onClick={parentCrumbs[0]?.onClick}
            aria-label="Go back"
          >
            <ChevronLeftIcon />
          </Button>
        )}
        <Breadcrumb>
          <BreadcrumbList>
            {parentCrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={crumb.onClick}>
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentCrumb?.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {actions && <div className={styles.right}>{actions}</div>}
    </div>
  );
}
